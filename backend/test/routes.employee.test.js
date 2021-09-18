const app = require("../app.js");
const supertest = require("supertest");
const agent = supertest.agent(app);
const db = require("../models/db.js");

beforeEach(async () => {
  await agent
    .post("/API/user/login")
    .send({ username: "dorco", password: "blade" })
    .expect(200)

  await db.query("SET FOREIGN_KEY_CHECKS = 0;");
  await db.query("TRUNCATE TABLE EmployeeSalaries;");
  await db.query("TRUNCATE TABLE Employees;");
  await db.query("SET FOREIGN_KEY_CHECKS = 1;");


});




test.each`
  obj | expected
  ${{
    employeeNo: "TEST-425",
    firstName: "Brian",
    middleName: "David",
    lastName: "Johnson",
    sex: "M",
    contactNo: "093421492429",
    hireDate: "2000-05-30",
    birthDate: "2030-05-30",
    employeePositionID: "1",
    employeeDepartmentID: "3"

  }} | ${{ "status": true }}

  ${{
    employeeNo: "TEST-425",
    firstName: "Brian",
    middleName: "David",
    lastName: "Johnson",
    sex: "Male",
    contactNo: "093421492429",
    hireDate: "2000-05-30",
    birthDate: "2030-05-30",
    employeePositionID: "1",
    employeeDepartmentID: "3"

  }} | ${{ "status": false }}

  ${{
    employeeNo: "TEST-425",
    firstName: "Brian",
    middleName: "David",
    lastName: "Johnson",
    sex: "M",
    contactNo: "093421492429",
    hireDate: "200005-30",
    birthDate: "2030-05-30",
    employeePositionID: "1",
    employeeDepartmentID: "3"

  }} | ${{ "status": false }}
`('returns $expected from conditionals in $obj', async ({ obj, expected }) => {

    await agent.post("/API/employee/insert")
      .send(obj)
      .expect(200)
      .then(async (response) => {

        let respStatus = response.body.status;

        // Check the response
        expect(respStatus).toBe(expected.status);

        // Check data in the database
        // const post = await Post.findOne({ _id: response.body._id });
        // expect(post).toBeTruthy();
        // expect(post.title).toBe(data.title);
        // expect(post.content).toBe(data.content);
      });
  });