from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from ocr import process_image  

app = FastAPI()

@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    try:
        content = await file.read()
        result = process_image(content)
        return JSONResponse(content={"result": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))