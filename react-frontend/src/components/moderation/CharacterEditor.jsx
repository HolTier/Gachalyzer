import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { data } from "react-router-dom"

const supportedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

const schema = yup
    .object({
        name: yup.string().required("Name is required"),
        game: yup.string.required("Game is required"),
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
                    !value ||
                    (value instanceof File && supportedImageTypes.includes(value.type))
            )
    })

function CharacterEditor() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })
    const onSubmit = (data) => console.log(data);
    return (
        
    )
}

export default CharacterEditor;