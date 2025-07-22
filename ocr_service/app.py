from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse 
from ocr_main import process_image

app = FastAPI(
    redirect_slashes=False
)

@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    print("Received file:", file.filename)
    try:
        content = await file.read()
        result = await process_image(content)
        return JSONResponse(content={"result": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))