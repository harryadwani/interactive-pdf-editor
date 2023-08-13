import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { PDFDocument, rgb } from 'pdf-lib';
import * as fs from 'fs/promises';

@Controller('pdf')
export class PdfController {
    private pdfPath = 'src/pdf/example.pdf';

    @Get('load')
    async loadPdf(@Res() res: Response) {
        try {
            const pdfData = await fs.readFile(this.pdfPath);
            res.send(pdfData);
        } catch (error) {
            return res.status(500).send('Error loading PDF');
        }
    }

    @Post('save')
    async savePdf(@Body() body: any, @Res() res: Response) {
        try {
            const pdfBase64 = body.pdfData as string;
            const pdfData = Buffer.from(pdfBase64, 'base64');

            const pdfDoc = await PDFDocument.load(pdfData);
            const modifiedPdfBytes = await pdfDoc.save();
            await fs.writeFile('src/pdf/example1.pdf', modifiedPdfBytes);

            res.send('PDF saved successfully');
        } catch (error) {
            console.log(error);
            res.status(500).send('Error saving PDF');
        }
    }
}
