/**

 */
class TijdlijnRoutes {
    // Import necessary modules
    #httpErrorCodes = require("../framework/utils/httpErrorCodes");
    #databaseHelper = require("../framework/utils/databaseHelper");
    #app;

    /**
     * Constructor for TijdlijnRoutes class
     * @param {Object} app - Express app object
     */
    constructor(app) {
        this.#app = app;

        // Register route handlers
        this.#getStoriesPerMonth();
        this.#getStoriesByMonth();
    }

    #getStoriesPerMonth() {
        this.#app.get("/timelineRodin/get", async(req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT *, (SELECT CONCAT(voornaam, ' ', tussenvoegsel, ' ', achternaam) FROM users WHERE id = subquery.gebruiker) as gebruikersnaam " +
                        "FROM ( " +
                        "  SELECT * " +
                        "  FROM posts " +
                        "  WHERE EXTRACT(YEAR_MONTH FROM jaartalGebeurtenis) IN ( " +
                        "    SELECT EXTRACT(YEAR_MONTH FROM jaartalGebeurtenis) AS yearMonth " +
                        "    FROM posts " +
                        "    GROUP BY yearMonth " +
                        "  ) " +
                        "  ORDER BY publicatieDatum DESC " +
                        ") AS subquery " +
                        "GROUP BY EXTRACT(YEAR_MONTH FROM jaartalGebeurtenis) " +
                        "ORDER BY jaartalGebeurtenis DESC;",
                    values: []
                })

                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data)
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        })
    }

    #getStoriesByMonth() {
        this.#app.get("/timelineRodin/getByMonth/:month/:year", async(req, res) => {
            const month = req.params.month;
            const year = req.params.year;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * " +
                        "FROM posts " +
                        "WHERE soortBericht = 'verhaal' " +
                        "AND EXTRACT(MONTH FROM jaartalGebeurtenis) = ? " +
                        "AND EXTRACT(YEAR FROM jaartalGebeurtenis) = ?;",
                    values: [month, year]
                })
                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data)
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        })
    }


}

module.exports = TijdlijnRoutes;
