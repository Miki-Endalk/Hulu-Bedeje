import request from "supertest";
import app from "../app";
import pool from "../config/db";

describe("Authentication & Role Authorization Endpoints", () => {
    const extractCookies = (res) => {
        const rawCookies = res.headers["set-cookie"];

        // delete later
        console.log("Printing raw cookies 1 \n", rawCookies);

        if (!rawCookies) return "";
        return Array.isArray(rawCookies) ? rawCookies.join("; ") : rawCookies;
    };

    const registerUser = async (email, password = "Password123!", name = "Test User") => {
        const res = await request(app)
            .post("/api/auth/sign-up/email")
            .send({ email, password, name });

        return extractCookies(res);
    }

    const setUserRole = async (email, role) => {
        await pool.query('UPDATE "user" SET role = $1 WHERE email = $2', [role, email]);
    };

    describe("1. Unauthenticated Access", () => {

        it("should return 401 Unauthorized when accessing /api/v1/auth/test/test-customer without a session", async () => {
            const response = await request(app).get("/api/v1/auth/test/test-customer");

            expect(response.statusCode).toBe(401);
            expect(response.body).toMatchObject({
                success: false,
                message: expect.stringMatching(/Unauthorized/)
            });
        });

        it("should return 401 Unauthorized when accessing /api/v1/auth/test/test-artisan without a session", async() => {
            const response = await request(app).get("/api/v1/auth/test/test-artisan");

            expect(response.statusCode).toBe(401);
        });

        it("should return 401 Unauthorized when accessing /api/v1/auth/test/test-admin without a session", async() => {
            const response = await request(app).get("/api/v1/auth/test/test-admin");

            expect(response.statusCode).toBe(401);
        });
    });


    
    describe("2. Customer Role Authorization", () => {
        let customerCookie;

        beforeEach(async () => {
            customerCookie = await registerUser("customer@example.com", "Password123!", "Customer Account")
        });

        it("should return 200 OK when accessing /api/v1/auth/test/test-customer", async () => {
            const response = await request(app)
                .get("/api/v1/auth/test/test-customer")
                .set("Cookie", customerCookie);

            expect(response.statusCode).toBe(200)
        });

        it("should return 403 Forbidden when accessing /api/v1/auth/test/test-artisan", async () => {
            const response = await request(app)
                .get("/api/v1/auth/test/test-artisan")
                .set("Cookie", customerCookie);
            
            expect(response.statusCode).toBe(403);
            expect(response.body).toMatchObject({
                success: false,
                message: expect.stringMatching(/Forbidden/i)
            });
        });

        it("should return 403 Forbidden when accessing /api/v1/auth/test/test-admin", async () => {
            const response = await request(app)
                .get("/api/v1/auth/test/test-admin")
                .set("Cookie", customerCookie);
            
            expect(response.statusCode).toBe(403);
            expect(response.body).toMatchObject({
                success: false,
                message: expect.stringMatching(/Forbidden/i)
            });
        });
    });



    describe("3. Artisan Role Authorization", () => {
        let artisanCookie;

        beforeEach(async () => {
            const email = "artisan@example.com";
            artisanCookie = await registerUser(email, "Password123!", "Customer Account")

            await setUserRole(email, "artisan");
        });

        it("should return 403 Forbidden when accessing /api/v1/auth/test/test-customer", async () => {
            const response = await request(app)
                .get("/api/v1/auth/test/test-customer")
                .set("Cookie", artisanCookie);

            expect(response.statusCode).toBe(403);
            expect(response.body).toMatchObject({
                success: false,
                message: expect.stringMatching(/Forbidden/i)
            });
        });

        it("should return 200 OK when accessing /api/v1/auth/test/test-artisan", async () => {
            const response = await request(app)
                .get("/api/v1/auth/test/test-artisan")
                .set("Cookie", artisanCookie);
            
            expect(response.statusCode).toBe(200)
        });

        it("should return 403 Forbidden when accessing /api/v1/auth/test/test-admin", async () => {
            const response = await request(app)
                .get("/api/v1/auth/test/test-admin")
                .set("Cookie", artisanCookie);
            
            expect(response.statusCode).toBe(403);
            expect(response.body).toMatchObject({
                success: false,
                message: expect.stringMatching(/Forbidden/i)
            });
        });
    });


    describe("4. Administrator Role Authorization", () => {
        let adminCookie;

        beforeEach(async () => {
            const email = "admin@example.com";
            adminCookie = await registerUser(email, "Password123!", "Customer Account")

            await setUserRole(email, "administrator");
        });

        it("should return 403 Forbidden when accessing /api/v1/auth/test/test-customer", async () => {
            const response = await request(app)
                .get("/api/v1/auth/test/test-customer")
                .set("Cookie", adminCookie);

            expect(response.statusCode).toBe(403);
            expect(response.body).toMatchObject({
                success: false,
                message: expect.stringMatching(/Forbidden/i)
            });
        });

        it("should return 403 Forbidden accessing /api/v1/auth/test/test-artisan", async () => {
            const response = await request(app)
                .get("/api/v1/auth/test/test-artisan")
                .set("Cookie", adminCookie);
            
            expect(response.statusCode).toBe(403);
            expect(response.body).toMatchObject({
                success: false,
                message: expect.stringMatching(/Forbidden/i)
            });
        });

        it("should return 200 OK when when accessing /api/v1/auth/test/test-admin", async () => {
            const response = await request(app)
                .get("/api/v1/auth/test/test-admin")
                .set("Cookie", adminCookie);
            
            expect(response.statusCode).toBe(200)
        });
    });
})