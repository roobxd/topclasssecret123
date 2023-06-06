/**
 * Routes file for the support file.
 * File description: This file contains the SupportRoutes class, which defines the API endpoints for the support functionality.
 * @author: Kifleyesus Musgun Sium
 */

const https = require('https'); // Import the 'https' module

class SupportRoutes {
    #app;
    #databaseHelper = require("../framework/utils/databaseHelper");
    #httpErrorCodes = require("../framework/utils/httpErrorCodes");

    /**
     * Class constructor.
     * @param {Object} app - The application.
     */
    constructor(app) {
        this.#app = app;
        this.#createSupport();
        this.#sendMail();
    }

    /**
     * Creates the support endpoint.
     * @private
     */
    #createSupport() {
        this.#app.post("/support", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO faq(name, email, question) VALUES (?,?,?);",
                    values: [req.body.name, req.body.email, req.body.question]
                });

                if (data.insertId) {
                    res.status(this.#httpErrorCodes.HTTP_OK_CODE).json({ id: data.insertId });
                }
            } catch (e) {
                console.log(e);
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        });
    }

    /**
     * Sends an email.
     * @private
     */
    #sendMail() {
        this.#app.post("/sendmail", async (req, res) => {
            const fromEmail = 'buurtposter@hbo-ict.cloud';
            const apiKey = 'pad_flo_7.Ixxt5Fxzg0fJObw7';
            const { name, email, question } = req.body;

            const data = JSON.stringify({
                from: fromEmail,
                to: email,
                subject: "Vraag van klant",
                text: question,
                html: name,
            });

            const options = {
                hostname: 'api.hbo-ict.cloud',
                port: 443,
                path: '/mail',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            };

            const request = https.request(options, (response) => {
                response.on('data', (d) => {
                    process.stdout.write(d);
                });
            });

            request.on('error', (error) => {
                console.error(error);
            });

            request.write(data);
            request.end();
        });
    }
}

module.exports = SupportRoutes;
