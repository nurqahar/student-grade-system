import { jest } from "@jest/globals";

// --- Mock dependencies sebelum import controller (wajib untuk ESM) ---
const mockAchievement = {
  create: jest.fn(),
  uploadCsv: jest.fn(),
  viewDetail: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockSubjects = {
  getAll: jest.fn(),
};

const mockSuccessResponse = jest.fn((res, { data, statusCode = 200 }) =>
  res.status(statusCode).json({ success: true, data }),
);

const mockErrorResponse = jest.fn((res, { message, errors, statusCode = 500, data }) =>
  res.status(statusCode).json({ success: false, message, errors, data }),
);

jest.unstable_mockModule("./achievement.model.mjs", () => ({
  default: mockAchievement,
}));

jest.unstable_mockModule("../subjects/subject.model.mjs", () => ({
  default: mockSubjects,
}));

jest.unstable_mockModule("../utils/response.mjs", () => ({
  successResponse: mockSuccessResponse,
  errorResponse: mockErrorResponse,
}));

// Import controller SETELAH mock didaftarkan
const {
  create,
  uploadCsv,
  viewDetail,
  getAll,
  getById,
  update,
  deleteData,
} = await import("./achievement.controller.mjs");

// --- Helper untuk membuat mock req/res Express ---
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Achievement Controller", () => {
  // ---------------------------------------------------------------
  describe("create", () => {
    it("berhasil membuat achievement baru (201)", async () => {
      const req = { body: { competency_achievement: "Paham materi A" } };
      const res = mockRes();
      const created = { id: 1, ...req.body };

      mockAchievement.create.mockResolvedValue(created);

      await create(req, res);

      expect(mockAchievement.create).toHaveBeenCalledWith(req.body);
      expect(mockSuccessResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ data: created, statusCode: 201 }),
      );
    });

    it("mengembalikan error jika Achievement.create gagal", async () => {
      const req = { body: {} };
      const res = mockRes();
      const err = new Error("DB error");

      mockAchievement.create.mockRejectedValue(err);

      await create(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ errors: err }),
      );
    });
  });

  // ---------------------------------------------------------------
  describe("uploadCsv", () => {
    it("mengembalikan 400 jika data kosong", async () => {
      const req = { body: { data: [] } };
      const res = mockRes();

      await uploadCsv(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ message: "Empty Data!", statusCode: 400 }),
      );
      expect(mockSubjects.getAll).not.toHaveBeenCalled();
    });

    it("mengembalikan 400 jika req.body.data tidak ada", async () => {
      const req = { body: {} };
      const res = mockRes();

      await uploadCsv(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ message: "Empty Data!", statusCode: 400 }),
      );
    });

    it("mengembalikan error jika gagal mengambil data subjects", async () => {
      const req = { body: { data: [{ subject_name: "Matematika" }] } };
      const res = mockRes();
      const err = new Error("gagal ambil subjects");

      mockSubjects.getAll.mockRejectedValue(err);

      await uploadCsv(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ errors: err }),
      );
      expect(mockAchievement.uploadCsv).not.toHaveBeenCalled();
    });

    it("mengembalikan 404 jika tidak ada baris csv yang cocok dengan subject di db", async () => {
      const req = {
        body: {
          data: [{ subject_name: "Tidak Ada", competency_achievement: "x", school_year: "2024/2025", semester: "1" }],
        },
      };
      const res = mockRes();

      mockSubjects.getAll.mockResolvedValue([{ id: 1, subject_name: "Matematika" }]);

      await uploadCsv(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          statusCode: 404,
          data: req.body.data,
        }),
      );
      expect(mockAchievement.uploadCsv).not.toHaveBeenCalled();
    });

    it("berhasil memproses & insert baris csv yang cocok, skip yang tidak cocok", async () => {
      const req = {
        body: {
          data: [
            {
              subject_name: "Matematika",
              competency_achievement: "Paham operasi hitung",
              school_year: "2024/2025",
              semester: "1",
            },
            {
              subject_name: "Tidak Ada",
              competency_achievement: "x",
              school_year: "2024/2025",
              semester: "1",
            },
          ],
        },
      };
      const res = mockRes();

      mockSubjects.getAll.mockResolvedValue([{ id: 5, subject_name: "Matematika" }]);
      const inserted = [{ id: 1, subject_id: 5 }];
      mockAchievement.uploadCsv.mockResolvedValue(inserted);

      await uploadCsv(req, res);

      expect(mockAchievement.uploadCsv).toHaveBeenCalledWith([
        {
          subject_id: 5,
          competency_achievement: "Paham operasi hitung",
          school_year: "2024/2025",
          semester: 1,
        },
      ]);
      expect(mockSuccessResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ data: inserted, statusCode: 201 }),
      );
    });

    it("mengembalikan error jika Achievement.uploadCsv gagal saat insert", async () => {
      const req = {
        body: {
          data: [{ subject_name: "Matematika", competency_achievement: "x", school_year: "2024/2025", semester: "1" }],
        },
      };
      const res = mockRes();
      const err = new Error("insert gagal");

      mockSubjects.getAll.mockResolvedValue([{ id: 5, subject_name: "Matematika" }]);
      mockAchievement.uploadCsv.mockRejectedValue(err);

      await uploadCsv(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ errors: err }),
      );
    });
  });

  // ---------------------------------------------------------------
  describe("viewDetail", () => {
    it("berhasil mengambil detail berdasarkan className", async () => {
      const req = { query: { className: "X IPA 1" } };
      const res = mockRes();
      const data = [{ id: 1 }];

      mockAchievement.viewDetail.mockResolvedValue(data);

      await viewDetail(req, res);

      expect(mockAchievement.viewDetail).toHaveBeenCalledWith("X IPA 1");
      expect(mockSuccessResponse).toHaveBeenCalledWith(res, expect.objectContaining({ data }));
    });

    it("mengembalikan error jika viewDetail gagal", async () => {
      const req = { query: {} };
      const res = mockRes();
      const err = new Error("gagal");

      mockAchievement.viewDetail.mockRejectedValue(err);

      await viewDetail(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(res, expect.objectContaining({ errors: err }));
    });
  });

  // ---------------------------------------------------------------
  describe("getAll", () => {
    it("berhasil mengambil semua data", async () => {
      const req = {};
      const res = mockRes();
      const data = [{ id: 1 }, { id: 2 }];

      mockAchievement.getAll.mockResolvedValue(data);

      await getAll(req, res);

      expect(mockSuccessResponse).toHaveBeenCalledWith(res, expect.objectContaining({ data }));
    });

    it("mengembalikan error jika getAll gagal", async () => {
      const req = {};
      const res = mockRes();
      const err = new Error("gagal");

      mockAchievement.getAll.mockRejectedValue(err);

      await getAll(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(res, expect.objectContaining({ errors: err }));
    });
  });

  // ---------------------------------------------------------------
  describe("getById", () => {
    it("mengembalikan 400 jika id bukan angka", async () => {
      const req = { params: { id: "abc" } };
      const res = mockRes();

      await getById(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ message: "ID tidak valid!", statusCode: 400 }),
      );
      expect(mockAchievement.getById).not.toHaveBeenCalled();
    });

    it("mengembalikan 400 jika id <= 0", async () => {
      const req = { params: { id: "0" } };
      const res = mockRes();

      await getById(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ statusCode: 400 }),
      );
    });

    it("mengembalikan 404 jika data tidak ditemukan", async () => {
      const req = { params: { id: "10" } };
      const res = mockRes();

      mockAchievement.getById.mockResolvedValue(null);

      await getById(req, res);

      expect(mockAchievement.getById).toHaveBeenCalledWith(10);
      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ message: "Data not found!", statusCode: 404 }),
      );
    });

    it("berhasil mengambil data berdasarkan id", async () => {
      const req = { params: { id: "1" } };
      const res = mockRes();
      const data = { id: 1, competency_achievement: "abc" };

      mockAchievement.getById.mockResolvedValue(data);

      await getById(req, res);

      expect(mockSuccessResponse).toHaveBeenCalledWith(res, expect.objectContaining({ data }));
    });

    it("mengembalikan error jika getById gagal", async () => {
      const req = { params: { id: "1" } };
      const res = mockRes();
      const err = new Error("gagal");

      mockAchievement.getById.mockRejectedValue(err);

      await getById(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(res, expect.objectContaining({ errors: err }));
    });
  });

  // ---------------------------------------------------------------
  describe("update", () => {
    it("mengembalikan 400 jika id tidak valid", async () => {
      const req = { params: { id: "abc" }, body: {} };
      const res = mockRes();

      await update(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ message: "ID tidak valid!", statusCode: 400 }),
      );
      expect(mockAchievement.update).not.toHaveBeenCalled();
    });

    it("mengembalikan 404 jika data dengan id tersebut tidak ditemukan", async () => {
      const req = { params: { id: "99" }, body: { competency_achievement: "baru" } };
      const res = mockRes();

      mockAchievement.getById.mockResolvedValue(null);

      await update(req, res);

      expect(mockAchievement.getById).toHaveBeenCalledWith(99);
      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ message: "id Not Found!", statusCode: 404, data: null }),
      );
      expect(mockAchievement.update).not.toHaveBeenCalled();
    });

    it("berhasil update data dan mengembalikan status 200", async () => {
      const req = { params: { id: "1" }, body: { competency_achievement: "baru" } };
      const res = mockRes();
      const updated = { id: 1, competency_achievement: "baru" };

      mockAchievement.getById.mockResolvedValue({ id: 1 });
      mockAchievement.update.mockResolvedValue(updated);

      await update(req, res);

      expect(mockAchievement.update).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it("mengembalikan error jika Achievement.update gagal", async () => {
      const req = { params: { id: "1" }, body: {} };
      const res = mockRes();
      const err = new Error("update gagal");

      mockAchievement.getById.mockResolvedValue({ id: 1 });
      mockAchievement.update.mockRejectedValue(err);

      await update(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(res, expect.objectContaining({ errors: err }));
    });
  });

  // ---------------------------------------------------------------
  describe("deleteData", () => {
    it("mengembalikan 400 jika id tidak valid", async () => {
      const req = { params: { id: "-1" } };
      const res = mockRes();

      await deleteData(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ message: "ID tidak valid!", statusCode: 400 }),
      );
      expect(mockAchievement.delete).not.toHaveBeenCalled();
    });

    it("mengembalikan 404 jika data dengan id tersebut tidak ditemukan", async () => {
      const req = { params: { id: "99" } };
      const res = mockRes();

      mockAchievement.getById.mockResolvedValue(null);

      await deleteData(req, res);

      expect(mockAchievement.getById).toHaveBeenCalledWith(99);
      expect(mockErrorResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ message: "id Not Found!", statusCode: 404, data: null }),
      );
      expect(mockAchievement.delete).not.toHaveBeenCalled();
    });

    it("berhasil menghapus data (204)", async () => {
      const req = { params: { id: "1" } };
      const res = mockRes();
      const deleted = { id: 1 };

      mockAchievement.getById.mockResolvedValue({ id: 1 });
      mockAchievement.delete.mockResolvedValue(deleted);

      await deleteData(req, res);

      expect(mockAchievement.delete).toHaveBeenCalledWith(1);
      expect(mockSuccessResponse).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ data: deleted, statusCode: 204 }),
      );
    });

    it("mengembalikan error jika Achievement.delete gagal", async () => {
      const req = { params: { id: "1" } };
      const res = mockRes();
      const err = new Error("delete gagal");

      mockAchievement.getById.mockResolvedValue({ id: 1 });
      mockAchievement.delete.mockRejectedValue(err);

      await deleteData(req, res);

      expect(mockErrorResponse).toHaveBeenCalledWith(res, expect.objectContaining({ errors: err }));
    });
  });
});
