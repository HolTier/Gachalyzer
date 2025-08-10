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
            (value) => !value || (value instanceof File && value.size <= 5 * 1024 * 1024)
        )
        .test(
            "fileType",
            "Unsupported file type",
            (value) =>
                !value || (value instanceof File && supportedImageTypes.includes(value.type))
        ),
    icon: yup
        .mixed()
        .nullable()
        .test(
            "fileSize",
            "File size is too large (max 5MB)",
            (value) => !value || (value instanceof File && value.size <= 5 * 1024 * 1024)
        )
        .test(
            "fileType",
            "Unsupported file type",
            (value) =>
                !value || (value instanceof File && supportedImageTypes.includes(value.type))
        ),
});