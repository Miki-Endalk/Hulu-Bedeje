
export const healthCheck = (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: "okay",
            uptime: process.uptime
        },
        error: null
    })
}

export default healthCheck