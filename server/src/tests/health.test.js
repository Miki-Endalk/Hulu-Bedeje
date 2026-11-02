import request from "supertest"
import app from "../app"

describe("Healthcheck and Basic App Setup", () => {
    it("should respond with a 200 status code on GET /", async () => {
        const response =  await request(app).get("/api/v1/health")

        expect(response.statusCode).toBe(200)
        expect(response.body.data.status).toBe("okay")
    })

    it("should return a 404 for unknown endpoints", async () => {
        const reponse = await request(app).get("/api/non-existent-route")

        expect(reponse.statusCode).toBe(404);
    })
})