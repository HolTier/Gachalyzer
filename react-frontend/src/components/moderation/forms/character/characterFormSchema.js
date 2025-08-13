import * as yup from "yup";

const supportedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
export const characterFormSchema = yup.object({
    name: yup.string().required("Name is required"),
    game: yup.number().typeError("Game is required").required("Game is required"),
    element: yup.number().typeError("Element is required").required("Element is required"),
    weapon: yup.number().typeError("Weapon is required").required("Weapon is required"),
    CharacterStatScaling: yup.array().of(
        yup.object({
            StatTypeId: yup.number().required("Stat type is required"),
            Level: yup.number().required("Level is required"),
            Value: yup.number().typeError("Value must be a number").required("Value is required"),
            IsBreakpoint: yup.boolean().typeError("Breakpoint must be a number").required("Breakpoint is required"),
        })
    ).optional(),
    image: yup
        .mixed()
        .nullable()
        .test(
            "fileSize",
            "File size is too large (max 5MB)",
            (value) => {
                // Skip validation for server images
                if (value && value.isServerImage) {
                    console.log("Skipping image file size validation for server image:", value);
                    return true;
                }
                // Validate only actual File objects
                const isValid = !value || (value instanceof File && value.size <= 5 * 1024 * 1024);
                if (!isValid) {
                    console.log("Image file size validation failed for:", value);
                }
                return isValid;
            }
        )
        .test(
            "fileType",
            "Unsupported file type",
            (value) => {
                // Skip validation for server images
                if (value && value.isServerImage) {
                    console.log("Skipping image file type validation for server image:", value);
                    return true;
                }
                // Validate only actual File objects
                const isValid = !value || (value instanceof File && supportedImageTypes.includes(value.type));
                if (!isValid) {
                    console.log("Image file type validation failed for:", value);
                }
                return isValid;
            }
        ),
    icon: yup
        .mixed()
        .nullable()
        .test(
            "fileSize",
            "File size is too large (max 5MB)",
            (value) => {
                // Skip validation for server images
                if (value && value.isServerImage) {
                    console.log("Skipping icon file size validation for server image:", value);
                    return true;
                }
                // Validate only actual File objects
                const isValid = !value || (value instanceof File && value.size <= 5 * 1024 * 1024);
                if (!isValid) {
                    console.log("Icon file size validation failed for:", value);
                }
                return isValid;
            }
        )
        .test(
            "fileType",
            "Unsupported file type",
            (value) => {
                // Skip validation for server images
                if (value && value.isServerImage) {
                    console.log("Skipping icon file type validation for server image:", value);
                    return true;
                }
                // Validate only actual File objects
                const isValid = !value || (value instanceof File && supportedImageTypes.includes(value.type));
                if (!isValid) {
                    console.log("Icon file type validation failed for:", value);
                }
                return isValid;
            }
        ),
});