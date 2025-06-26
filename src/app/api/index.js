export const getData = async (req, res) => {
    try {
        // Simulate fetching data from a database or external API
        //
        const data = { message: "Hello, World!" };
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}