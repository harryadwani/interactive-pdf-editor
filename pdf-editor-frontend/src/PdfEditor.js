import React, { useState } from 'react';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';

const PdfEditor = () => {
    const [pdfData, setPdfData] = useState(null);

    const handleLoadPdf = async () => {
        try {
            const response = await axios.get('http://localhost:3001/pdf/load', {
                responseType: 'arraybuffer',
            });
            setPdfData(new Uint8Array(response.data));
        } catch (error) {
            console.error('Error loading PDF:', error);
        }
    };

    const handleSavePdf = async () => {
        try {
            const modifiedPdfDoc = await PDFDocument.load(pdfData);

            const modifiedPdfBytes = await modifiedPdfDoc.save();
            const modifiedPdfBase64 = btoa(String.fromCharCode(...modifiedPdfBytes));

            const requestData = {
                pdfData: modifiedPdfBase64,
            };

            await axios.post('http://localhost:3001/pdf/save', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('PDF saved successfully');
        } catch (error) {
            console.error('Error saving PDF:', error);
        }
    };

    let pdfUrl = null;
    if (pdfData) {
        const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
        pdfUrl = URL.createObjectURL(pdfBlob);
    }

    return (
        <div>
            <button onClick={handleLoadPdf}>Load</button>
            <button onClick={handleSavePdf}>Submit</button>
            {pdfUrl && (
                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="500px"
                    title="PDF Viewer"
                />
            )}
        </div>
    );
};

export default PdfEditor;
