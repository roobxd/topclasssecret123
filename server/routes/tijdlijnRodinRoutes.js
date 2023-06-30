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
                    query: "SELECT t.* " +
                        "FROM posts t " +
                        "JOIN (" +
                        "  SELECT EXTRACT(YEAR_MONTH FROM publicatieDatum) AS yearMonth, " +
                        "         MAX(publicatieDatum) AS recentPost " +
                        "  FROM posts " +
                        "  WHERE soortBericht = 'verhaal' " +
                        "  GROUP BY yearMonth " +
                        ") AS subquery " +
                        "ON EXTRACT(YEAR_MONTH FROM t.publicatieDatum) = subquery.yearMonth " +
                        "   AND t.publicatieDatum = subquery.recentPost " +
                        "WHERE t.soortBericht = 'verhaal' " +
                        "ORDER BY t.jaartalGebeurtenis;",
                    values: []
                })

                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data)
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        })
    }

    #getStoriesByMonth() {
        this.#app.get("/timelineRodin/getByMonth/:month", async(req, res) => {
            const month = req.params.month;

            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT * " +
                        "FROM posts " +
                        "WHERE soortBericht = 'verhaal' " +
                        "AND EXTRACT(MONTH FROM jaartalGebeurtenis) = ?;",
                    values: [month]
                })
                res.status(this.#httpErrorCodes.HTTP_OK_CODE).json(data)
            } catch (e) {
                res.status(this.#httpErrorCodes.BAD_REQUEST_CODE).json({ reason: e });
            }
        })
    }


}

module.exports = TijdlijnRoutes;
