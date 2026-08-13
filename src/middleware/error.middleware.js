const errorHandler = (err, req, res, next) => {
    if (err.name === "ValidationError") {

        const errors = {};

        Object.keys(err.errors).forEach(field => {
            errors[field] = err.errors[field].message;
        });

        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: errors
        });
    }
    if (err.code === 11000) {
        console.log("Duplicate Error:", err);

        const field = Object.keys(err.keyValue)[0];

        return res.status(400).json({
            success: false,
            message: "Duplicate value",
            errors: {
                [field]: `${field} already exists`
            }
        });
    }
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server Error",
        errors: err.errors
    })
}

module.exports = errorHandler;