// A tiny hand-written, valid single-page PDF (~500 bytes) for stories that
// need a real file react-pdf can actually decode — not part of the lib's
// public exports (see StoriesArgs.ts's own note on this folder).
const SAMPLE_PDF_TEXT = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 240 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 41 >>
stream
BT /F1 18 Tf 20 100 Td (AmphoreLib) Tj ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f
0000000000 00000 n
0000000000 00000 n
0000000000 00000 n
0000000000 00000 n
0000000000 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
0
%%EOF
`;

export const makeSamplePdfFile = (name = "document.pdf"): File =>
	new File([SAMPLE_PDF_TEXT], name, { type: "application/pdf" });
