export default class Rapor {
  static async getAssessment(levelNameInput, classNameInput) {
    const url = `http://localhost:9090/api/assessment/viewDetail?levelName=${levelNameInput}&className=${classNameInput}`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Res Status: ${res.status}`);
      }
      const responseArray = await res.json();
      return responseArray;
    } catch (error) {
      console.error(`Fetch Assessment Error!`, error.message);
    }
  }

  static async getAbsence(levelNameInput, classNameInput) {
    const url = `http://localhost:9090/api/absence/viewDetail?levelName=${levelNameInput}&className=${classNameInput}`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Res Status: ${res.status}`);
      }
      const responseArray = await res.json();
      return responseArray;
    } catch (error) {
      console.error(`Fetch Absence Error!`, error.message);
    }
  }
}
