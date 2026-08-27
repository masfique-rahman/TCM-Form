/* =========================================================
   SMARTFORM
   SUBMIT → PDF → GOOGLE DRIVE + GOOGLE SHEET → EMAILJS
   ========================================================= */


/* =========================================================
   EMAILJS CONFIGURATION
   ========================================================= */

const EMAILJS_PUBLIC_KEY =
    "D0nTXoKc0-_dFMUPI";

const EMAILJS_SERVICE_ID =
    "service_6pugrsg";

const EMAILJS_TEMPLATE_ID =
    "template_odo4me";


/* =========================================================
   GOOGLE APPS SCRIPT
   ========================================================= */

const GOOGLE_SHEETS_URL =
    "https://script.google.com/macros/s/AKfycbxlz8HXSKkLulUDvDccT3EeFnQUeaePeWGPpV59UmKity_5abP5X8Pp9bOoqCexxOGa/exec";


/* =========================================================
   INITIALIZE EMAILJS
   ========================================================= */

if (typeof emailjs !== "undefined") {
    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
    });
}


/* =========================================================
   ELEMENTS
   ========================================================= */

const form =
    document.getElementById("contactForm");

const submitBtn =
    document.getElementById("submitBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const printBtn =
    document.getElementById("printBtn");

const successMessage =
    document.getElementById("successMessage");

const signatureInput =
    document.getElementById("signature");

const previewSignature =
    document.getElementById("previewSignature");

const resultSheetInput =
    document.getElementById("resultSheet");


/* =========================================================
   GET VALUE
   ========================================================= */

function valueOf(id, fallback = "—") {

    const element =
        document.getElementById(id);

    if (!element) {
        return fallback;
    }

    const value =
        String(element.value || "").trim();

    return value || fallback;
}


/* =========================================================
   GET RAW VALUE
   ========================================================= */

function rawValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return "";
    }

    return String(element.value || "").trim();
}


/* =========================================================
   CURRENT DATE
   ========================================================= */

function getCurrentDate() {

    return new Date().toLocaleDateString(
        "en-GB"
    );

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(value) {

    if (!value) {
        return "—";
    }

    const parts =
        value.split("-");

    if (parts.length !== 3) {
        return value;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;

}


/* =========================================================
   REPORTING PERIOD
   ========================================================= */

function getReportingPeriod() {

    const selected =
        document.querySelector(
            'input[name="reporting_period"]:checked'
        );

    return selected
        ? selected.value
        : "—";

}


/* =========================================================
   PREVIEW VALUE
   ========================================================= */

function setPreview(
    previewId,
    value
) {

    const element =
        document.getElementById(previewId);

    if (!element) {
        return;
    }

    element.textContent =
        value || "—";

}


/* =========================================================
   COMBINE VALUES
   ========================================================= */

function combineValues(values) {

    return values
        .filter(value =>
            value &&
            value !== "—" &&
            value !== ""
        )
        .join(" | ") || "—";

}


/* =========================================================
   LIVE PREVIEW
   ========================================================= */

function updateAllPreview() {

    /* PERIOD */

    setPreview(
        "previewPeriod",
        getReportingPeriod()
    );


    /* Q1 */

    setPreview(
        "previewName",
        valueOf("name")
    );


    /* Q2 */

    setPreview(
        "previewInstitution",
        valueOf("institution")
    );


    /* Q3 */

    setPreview(
        "previewTeacher",

        combineValues([
            rawValue("teacherName"),
            rawValue("teacherPhone")
        ])
    );


    /* Q4 */

    setPreview(
        "previewCourse",
        valueOf("course")
    );


    /* Q5 */

    setPreview(
        "previewAcademic",

        combineValues([
            rawValue("levelTerm"),
            rawValue("session"),

            rawValue("roll")
                ? `রোল: ${rawValue("roll")}`
                : "",

            rawValue("group")
        ])
    );


    /* Q6 */

    const examStart =
        document.getElementById(
            "examStart"
        )?.value || "";

    const examEnd =
        document.getElementById(
            "examEnd"
        )?.value || "";

    setPreview(
        "previewExam",

        combineValues([
            rawValue("examName"),

            examStart && examEnd
                ? `${formatDate(examStart)} – ${formatDate(examEnd)}`
                : examStart
                    ? formatDate(examStart)
                    : examEnd
                        ? formatDate(examEnd)
                        : ""
        ])
    );


    /* Q7 */

    setPreview(
        "previewResultDate",

        formatDate(
            document.getElementById(
                "resultDate"
            )?.value
        )
    );


    /* Q8 */

    setPreview(
        "previewResult",

        combineValues([

            rawValue("gpa")
                ? `GPA: ${rawValue("gpa")}`
                : "",

            rawValue("grade")
                ? `Grade: ${rawValue("grade")}`
                : "",

            rawValue("score")
                ? `Score: ${rawValue("score")}`
                : "",

            rawValue("resultClass")
                ? `বিভাগ: ${rawValue("resultClass")}`
                : "",

            rawValue("obtainedMarks") ||
            rawValue("totalMarks")
                ? `প্রাপ্ত: ${rawValue("obtainedMarks") || "—"} / ${rawValue("totalMarks") || "—"}`
                : ""

        ])
    );


    /* Q9 */

    setPreview(
        "previewSpecialInfo",
        valueOf("specialInfo")
    );


    /* Q10 */

    setPreview(
        "previewPayment",

        combineValues([

            rawValue("paymentMethod"),

            rawValue("accountNumber")
                ? `হিসাব: ${rawValue("accountNumber")}`
                : "",

            rawValue("bankName")
                ? `ব্যাংক/কুরিয়ার: ${rawValue("bankName")}`
                : "",

            rawValue("branch")
                ? `শাখা: ${rawValue("branch")}`
                : ""

        ])
    );


    /* Q11 */

    const allowance = [];


    const allowance1Date =
        document.getElementById(
            "allowanceDate1"
        )?.value || "";

    const allowance1Amount =
        rawValue("allowanceAmount1");


    if (
        allowance1Date ||
        allowance1Amount
    ) {

        allowance.push(
            `১ম: ${
                allowance1Date
                    ? formatDate(allowance1Date)
                    : "—"
            } — ${
                allowance1Amount || "—"
            } টাকা`
        );

    }


    const allowance2Date =
        document.getElementById(
            "allowanceDate2"
        )?.value || "";

    const allowance2Amount =
        rawValue("allowanceAmount2");


    if (
        allowance2Date ||
        allowance2Amount
    ) {

        allowance.push(
            `২য়: ${
                allowance2Date
                    ? formatDate(allowance2Date)
                    : "—"
            } — ${
                allowance2Amount || "—"
            } টাকা`
        );

    }


    const allowance3Date =
        document.getElementById(
            "allowanceDate3"
        )?.value || "";

    const allowance3Amount =
        rawValue("allowanceAmount3");


    if (
        allowance3Date ||
        allowance3Amount
    ) {

        allowance.push(
            `৩য়: ${
                allowance3Date
                    ? formatDate(allowance3Date)
                    : "—"
            } — ${
                allowance3Amount || "—"
            } টাকা`
        );

    }


    setPreview(
        "previewAllowance",

        allowance.length
            ? allowance.join(" | ")
            : "—"
    );


    /* Q12 */

    setPreview(
        "previewDifficulty",
        valueOf("difficulty")
    );


    /* Q13 */

    setPreview(
        "previewPresentAddress",
        valueOf("presentAddress")
    );


    /* Q14 */

    setPreview(
        "previewContactAddress",
        valueOf("contactAddress")
    );


    /* Q15 */

    setPreview(
        "previewGuardianPhone",
        valueOf("guardianPhone")
    );


    /* SIGNATURE DATE */

    setPreview(
        "previewSignatureDate",

        formatDate(
            document.getElementById(
                "signatureDate"
            )?.value
        )
    );

}


/* =========================================================
   LIVE LISTENERS
   ========================================================= */

if (form) {

    form
        .querySelectorAll(
            "input, select, textarea"
        )
        .forEach(element => {

            element.addEventListener(
                "input",
                updateAllPreview
            );

            element.addEventListener(
                "change",
                updateAllPreview
            );

        });

}


updateAllPreview();


/* =========================================================
   SIGNATURE PREVIEW
   ========================================================= */

if (
    signatureInput &&
    previewSignature
) {

    signatureInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            if (!file) {

                previewSignature.src = "";

                previewSignature.style.display =
                    "none";

                return;

            }


            /* SIZE */

            if (
                file.size >
                2 * 1024 * 1024
            ) {

                alert(
                    "স্বাক্ষরের ছবি 2MB-এর কম হতে হবে।"
                );

                this.value = "";

                previewSignature.style.display =
                    "none";

                return;

            }


            /* TYPE */

            if (
                ![
                    "image/png",
                    "image/jpeg",
                    "image/jpg"
                ].includes(file.type)
            ) {

                alert(
                    "শুধুমাত্র PNG অথবা JPG ছবি upload করুন।"
                );

                this.value = "";

                previewSignature.style.display =
                    "none";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    previewSignature.src =
                        event.target.result;

                    previewSignature.style.display =
                        "block";

                };


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   VALIDATE FORM
   ========================================================= */

function validateForm() {

    if (!form) {
        return false;
    }


    if (!form.checkValidity()) {

        form.reportValidity();

        return false;

    }


    /* REPORTING PERIOD */

    if (
        !getReportingPeriod() ||
        getReportingPeriod() === "—"
    ) {

        alert(
            "অনুগ্রহ করে কোন ৩ মাসের প্রতিবেদন তা নির্বাচন করুন।"
        );

        return false;

    }


    /* SIGNATURE */

    const signature =
        signatureInput?.files?.[0];


    if (!signature) {

        alert(
            "অনুগ্রহ করে শিক্ষার্থীর স্বাক্ষর upload করুন।"
        );

        return false;

    }


    if (
        signature.size >
        2 * 1024 * 1024
    ) {

        alert(
            "স্বাক্ষরের ছবি 2MB-এর কম হতে হবে।"
        );

        return false;

    }


    /* RESULT SHEET (OPTIONAL) */

    const resultSheetFile =
        resultSheetInput?.files?.[0];


    if (resultSheetFile) {

        if (
            resultSheetFile.size >
            5 * 1024 * 1024
        ) {

            alert(
                "রেজাল্ট শীট ফাইল 5MB-এর কম হতে হবে।"
            );

            return false;

        }


        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "application/pdf"
        ];


        if (
            !allowedTypes.includes(
                resultSheetFile.type
            )
        ) {

            alert(
                "রেজাল্ট শীট হিসেবে শুধুমাত্র PNG, JPG অথবা PDF ফাইল upload করুন।"
            );

            return false;

        }

    }


    return true;

}


/* =========================================================
   FILE → DATA URL
   ========================================================= */

function fileToDataURL(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => resolve(
                    reader.result
                );


            reader.onerror =
                () => reject(
                    new Error(
                        "File could not be read."
                    )
                );


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   PDF FILE NAME
   ========================================================= */

function getPDFFileName() {

    let name =
        valueOf(
            "name",
            "Student"
        );


    name =
        name
            .replace(
                /[\\/:*?"<>|]/g,
                ""
            )
            .replace(
                /\s+/g,
                "_"
            )
            .trim();


    if (!name) {
        name = "Student";
    }


    return `${name}_application.pdf`;

}


/* =========================================================
   BUILD FOOTER IMAGE
   =====================================================

   আগে jsPDF-এর নিজের ফন্ট (helvetica) দিয়ে বাংলা টেক্সট
   আঁকা হতো, যেটাতে Bangla glyph সাপোর্ট নেই — ফলে PDF-এ
   অক্ষরগুলো ভাঙাচোরা (mojibake) দেখাতো।

   এখন ফুটারটাও বাকি ডকুমেন্টের মতোই html2canvas দিয়ে
   ব্রাউজারে রেন্ডার করে ছবি হিসেবে PDF-এ বসানো হয়, তাই
   বাংলা টেক্সট সবসময় সঠিকভাবে দেখাবে। শুধু পেজ নম্বর
   (Page X of Y) jsPDF দিয়ে আলাদাভাবে বসে, কারণ সেটা প্রতি
   পাতায় আলাদা হয় এবং শুধু ইংরেজি সংখ্যা/অক্ষর হওয়ায়
   কোনো সমস্যা হয় না।
   ========================================================= */

async function buildFooterImage(widthPx) {

    const footer =
        document.createElement("div");

    footer.style.position =
        "fixed";

    footer.style.left =
        "-100000px";

    footer.style.top =
        "0";

    footer.style.width =
        widthPx + "px";

    footer.style.boxSizing =
        "border-box";

    footer.style.background =
        "#ffffff";

    footer.style.padding =
        "8px 0 6px";

    footer.style.borderTop =
        "1px solid #d9dde3";

    footer.style.fontFamily =
        '"Noto Sans Bengali", "Inter", sans-serif';

    footer.style.textAlign =
        "center";


    footer.innerHTML = `
        <div style="font-size:10px; font-weight:700; color:#374151; line-height:1.6;">
            টিসিএম বাংলাদেশ &nbsp;|&nbsp; ২৮/১ পশ্চিম মালিবাগ, ঢাকা-১২১৭ &nbsp;|&nbsp; ফোন: ০৯৬১৩৬১৫৬৬৬, ০৯৬১৩৬১৫৬৭৭
        </div>
        <div style="font-size:9px; color:#6b7280; line-height:1.6; margin-top:1px;">
            ওয়েব: info@tcmbangladesh.org &nbsp;|&nbsp; ইমেইল: psks_tcm@yahoo.com, shahina@tcmbangladesh.org
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px; padding-top:5px; border-top:1px solid #f1f1f1; font-size:8px; color:#9aa2ad; font-family:'Inter',sans-serif;">
            <span>Developed by <strong style="color:#2563eb;">Masfiq Rahman Misha</strong></span>
            <span style="width:110px;"></span>
        </div>
    `;


    document.body.appendChild(
        footer
    );


    await new Promise(
        resolve =>
            requestAnimationFrame(
                resolve
            )
    );


    const canvas =
        await html2canvas(
            footer,
            {

                scale: 2,

                backgroundColor:
                    "#ffffff",

                useCORS: true,

                logging: false

            }
        );


    footer.remove();


    return canvas;

}


/* =========================================================
   DRAW FOOTER ON A GIVEN PDF PAGE
   ========================================================= */

function drawFooterOnPage(

    doc,
    pageNumber,
    totalPages,
    footerImageDataUrl,
    footerDrawHeight,
    pageWidth,
    pageHeight,
    margin

) {

    const footerY =
        pageHeight -
        margin -
        footerDrawHeight;


    doc.addImage(

        footerImageDataUrl,

        "PNG",

        margin,
        footerY,

        pageWidth - margin * 2,
        footerDrawHeight

    );


    /* Page number — plain Latin/digits, safe to draw with jsPDF's
       own font. Sits in the blank right-hand slot reserved in the
       footer image's bottom row. */

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(154, 162, 173);

    doc.text(
        `Page ${pageNumber} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - margin - 1.4,
        { align: "right" }
    );

}


/* =========================================================
   GENERATE PDF
   HTML2CANVAS USED FOR BANGLA SUPPORT
   ========================================================= */

async function generatePDF() {

    if (
        typeof html2canvas ===
        "undefined"
    ) {

        throw new Error(
            "html2canvas is not loaded."
        );

    }


    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {

        throw new Error(
            "jsPDF is not loaded."
        );

    }


    updateAllPreview();


    const paper =
        document.querySelector(
            ".paper"
        );


    if (!paper) {

        throw new Error(
            "Preview paper not found."
        );

    }


    /* =====================================================
       CLONE PAPER
       ===================================================== */

    const clone =
        paper.cloneNode(true);


    /* A4 width at 96dpi so the PDF page is a true A4 render */
    clone.style.position =
        "fixed";

    clone.style.left =
        "-100000px";

    clone.style.top =
        "0";

    clone.style.width =
        "794px";

    clone.style.minHeight =
        "1123px";

    clone.style.height =
        "auto";

    clone.style.maxHeight =
        "none";

    clone.style.overflow =
        "visible";

    clone.style.background =
        "#ffffff";

    clone.style.transform =
        "none";

    clone.style.boxShadow =
        "none";

    clone.style.margin =
        "0";


    /* =====================================================
       PDF TEXT SIZE
       ===================================================== */

    /* Question + Answer = 11px */

    clone.querySelectorAll(
        ".paper-row"
    ).forEach(row => {

        row.style.fontSize =
            "11px";

        row.style.lineHeight =
            "1.45";

    });


    clone.querySelectorAll(
        ".paper-label"
    ).forEach(label => {

        label.style.fontSize =
            "11px";

        label.style.fontWeight =
            "600";

    });


    clone.querySelectorAll(
        ".paper-value"
    ).forEach(value => {

        value.style.fontSize =
            "11px";

    });


    /*
       NOTE: .paper-header, .paper-logo-image, h2, h3 and
       .paper-period are already styled correctly in
       style.css (centered heading, absolutely-positioned
       logo, bottom border, badge styling). No JS overrides
       needed here — leaving the clone's header exactly as
       style.css renders it.
    */


    /* =====================================================
       SECTION HEADING = BOLD
       ===================================================== */

    clone.querySelectorAll(
        ".section-title"
    ).forEach(section => {

        section.style.fontWeight =
            "700";

        section.style.fontSize =
            "12px";

        section.style.color =
            "#1a2233";

    });


    /* =====================================================
       REMOVE THE ON-PAGE ADDRESS FOOTER FROM PDF IMAGE
       =====================================================

       PDF footer আমরা jsPDF দিয়ে আলাদাভাবে দেব, তাই
       cloned HTML-এর site-footer (address/phone/email/
       developed-by block) duplicate হবে না।

       NOTE: ".paper-footer" is the SIGNATURE block
       (তারিখ + শিক্ষার্থীর স্বাক্ষর) — that must stay
       visible in the PDF. Only ".site-footer" (the
       address footer) is hidden here.
    */

    clone.querySelectorAll(
        ".site-footer"
    ).forEach(footer => {

        footer.style.display =
            "none";

    });


    /* =====================================================
       APPEND CLONE
       ===================================================== */

    document.body.appendChild(
        clone
    );


    /* =====================================================
       WAIT FOR IMAGES
       ===================================================== */

    const images =
        clone.querySelectorAll(
            "img"
        );


    await Promise.all(

        Array.from(images).map(
            img => {

                if (
                    img.complete
                ) {

                    return Promise.resolve();

                }


                return new Promise(
                    resolve => {

                        img.onload =
                            resolve;

                        img.onerror =
                            resolve;

                    }
                );

            }
        )

    );


    /* =====================================================
       CANVAS
       ===================================================== */

    const canvas =
        await html2canvas(
            clone,
            {

                scale: 2,

                useCORS: true,

                allowTaint: false,

                backgroundColor:
                    "#ffffff",

                logging: false,

                imageTimeout:
                    15000

            }
        );


    /* REMOVE CLONE */

    clone.remove();


    /* =====================================================
       CREATE PDF — A4
       ===================================================== */

    const {
        jsPDF
    } = window.jspdf;


    const doc =
        new jsPDF(
            "p",
            "mm",
            "a4"
        );


    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();


    /*
       একটু margin রাখা হয়েছে
       যাতে footer-এর জন্য জায়গা থাকে।
    */

    const margin =
        7;


    const usableWidth =
        pageWidth -
        margin * 2;


    const imageHeight =
        (
            canvas.height /
            canvas.width
        ) *
        usableWidth;


    /* =====================================================
       FOOTER IMAGE (built once, reused on every page)
       ===================================================== */

    const footerCanvas =
        await buildFooterImage(794);

    const footerImageDataUrl =
        footerCanvas.toDataURL(
            "image/png"
        );

    const footerDrawHeight =
        (
            footerCanvas.height /
            footerCanvas.width
        ) *
        usableWidth;


    /* =====================================================
       MULTI PAGE
       ===================================================== */

    const footerSpace =
        footerDrawHeight +
        4;


    const usablePageHeight =
        pageHeight -
        margin -
        footerSpace;


    const pageImageHeight =
        usablePageHeight;


    let remainingHeight =
        imageHeight;


    let sourceY =
        0;


    let firstPage =
        true;


    while (
        remainingHeight > 0
    ) {

        if (!firstPage) {

            doc.addPage();

        }


        const pageCanvas =
            document.createElement(
                "canvas"
            );


        const pagePixelHeight =
            Math.min(

                canvas.height -
                sourceY,

                Math.floor(

                    canvas.width *
                    (
                        pageImageHeight /
                        usableWidth
                    )

                )

            );


        pageCanvas.width =
            canvas.width;

        pageCanvas.height =
            pagePixelHeight;


        const ctx =
            pageCanvas.getContext(
                "2d"
            );


        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(
            0,
            0,
            pageCanvas.width,
            pageCanvas.height
        );


        ctx.drawImage(

            canvas,

            0,
            sourceY,

            canvas.width,
            pagePixelHeight,

            0,
            0,

            canvas.width,
            pagePixelHeight

        );


        const pageImage =
            pageCanvas.toDataURL(
                "image/jpeg",
                0.96
            );


        const drawHeight =
            (
                pagePixelHeight /
                canvas.width
            ) *
            usableWidth;


        doc.addImage(

            pageImage,

            "JPEG",

            margin,
            margin,

            usableWidth,
            drawHeight

        );


        remainingHeight -=
            pageImageHeight;


        sourceY +=
            pagePixelHeight;


        firstPage =
            false;

    }


    /* =====================================================
       APPEND RESULT SHEET AS AN EXTRA PDF PAGE
       =====================================================

       শুধুমাত্র ছবি (PNG/JPG) হলে PDF-এর শেষে নতুন পাতা
       হিসেবে যুক্ত হয়। PDF ফাইল upload করা হলে সেটা
       ব্রাউজারে merge করার জন্য আলাদা লাইব্রেরি লাগবে,
       তাই সেক্ষেত্রে শুধু Google Sheet-এই যাবে, PDF-এ
       যুক্ত হবে না।
    */

    const resultSheetFile =
        resultSheetInput?.files?.[0];

    if (
        resultSheetFile &&
        resultSheetFile.type.startsWith("image/")
    ) {

        try {

            const resultSheetDataUrl =
                await fileToDataURL(
                    resultSheetFile
                );

            const resultImg =
                new Image();

            await new Promise(
                (resolve, reject) => {

                    resultImg.onload =
                        resolve;

                    resultImg.onerror =
                        reject;

                    resultImg.src =
                        resultSheetDataUrl;

                }
            );

            doc.addPage();

            const availableHeight =
                pageHeight -
                margin -
                footerSpace;

            const scale =
                Math.min(
                    usableWidth /
                    resultImg.width,

                    availableHeight /
                    resultImg.height
                );

            const drawW =
                resultImg.width *
                scale;

            const drawH =
                resultImg.height *
                scale;

            const drawX =
                margin +
                (usableWidth - drawW) /
                2;

            const drawY =
                margin +
                (availableHeight - drawH) /
                2;

            doc.addImage(

                resultSheetDataUrl,

                resultSheetFile.type.includes("png")
                    ? "PNG"
                    : "JPEG",

                drawX,
                drawY,

                drawW,
                drawH

            );

        }

        catch (err) {

            console.warn(
                "Result sheet could not be added to PDF:",
                err
            );

        }

    }


    /* =====================================================
       ADD FOOTER TO ALL PAGES
       ===================================================== */

    const totalPages =
        doc.getNumberOfPages();

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        doc.setPage(i);

        drawFooterOnPage(

            doc,
            i,
            totalPages,
            footerImageDataUrl,
            footerDrawHeight,
            pageWidth,
            pageHeight,
            margin

        );

    }


    return doc;

}


/* =========================================================
   DOWNLOAD PDF
   ========================================================= */

if (downloadBtn) {

    downloadBtn.addEventListener(
        "click",
        async function () {

            if (
                !validateForm()
            ) {

                return;

            }


            const oldText =
                downloadBtn.innerHTML;


            downloadBtn.disabled =
                true;


            downloadBtn.innerHTML =
                "Creating PDF...";


            try {

                const pdf =
                    await generatePDF();


                pdf.save(
                    getPDFFileName()
                );


                if (successMessage) {

                    successMessage.textContent =
                        "✓ PDF successfully downloaded.";

                    successMessage.style.color =
                        "#059669";

                }

            }

            catch (error) {

                console.error(
                    "PDF Error:",
                    error
                );


                if (successMessage) {

                    successMessage.textContent =
                        "✕ PDF তৈরি করা যায়নি।";

                    successMessage.style.color =
                        "#ef4444";

                }

            }


            downloadBtn.disabled =
                false;

            downloadBtn.innerHTML =
                oldText;

        }
    );

}


/* =========================================================
   PRINT
   ========================================================= */

if (printBtn) {

    printBtn.addEventListener(
        "click",
        function () {

            if (
                !validateForm()
            ) {

                return;

            }


            updateAllPreview();

            window.print();

        }
    );

}


/* =========================================================
   SAVE TO GOOGLE SHEET + DRIVE
   ========================================================= */

async function saveToGoogleSheet(
    pdfDataUri
) {

    /* RESULT SHEET (OPTIONAL) — read as base64 if attached */

    const resultSheetFile =
        resultSheetInput?.files?.[0];

    let resultSheetDataUri =
        "";

    if (resultSheetFile) {

        try {

            resultSheetDataUri =
                await fileToDataURL(
                    resultSheetFile
                );

        }

        catch (err) {

            console.warn(
                "Result sheet could not be read:",
                err
            );

        }

    }


    const data = {

        /* PERIOD */

        reporting_period:
            getReportingPeriod(),


        /* PERSONAL */

        name:
            rawValue("name"),

        institution:
            rawValue("institution"),

        teacher_name:
            rawValue("teacherName"),

        teacher_phone:
            rawValue("teacherPhone"),

        course:
            rawValue("course"),


        /* ACADEMIC */

        level_term:
            rawValue("levelTerm"),

        session:
            rawValue("session"),

        roll:
            rawValue("roll"),

        group:
            rawValue("group"),


        /* EXAM */

        exam_name:
            rawValue("examName"),

        exam_start:
            document.getElementById(
                "examStart"
            )?.value || "",

        exam_end:
            document.getElementById(
                "examEnd"
            )?.value || "",

        result_date:
            document.getElementById(
                "resultDate"
            )?.value || "",


        /* RESULT */

        gpa:
            rawValue("gpa"),

        grade:
            rawValue("grade"),

        score:
            rawValue("score"),

        result_class:
            rawValue("resultClass"),

        obtained_marks:
            rawValue("obtainedMarks"),

        total_marks:
            rawValue("totalMarks"),


        /* OTHER */

        special_info:
            rawValue("specialInfo"),


        /* PAYMENT */

        payment_method:
            rawValue("paymentMethod"),

        account_number:
            rawValue("accountNumber"),

        bank_name:
            rawValue("bankName"),

        branch:
            rawValue("branch"),


        /* ALLOWANCE 1 */

        allowance_date_1:
            document.getElementById(
                "allowanceDate1"
            )?.value || "",

        allowance_amount_1:
            rawValue("allowanceAmount1"),


        /* ALLOWANCE 2 */

        allowance_date_2:
            document.getElementById(
                "allowanceDate2"
            )?.value || "",

        allowance_amount_2:
            rawValue("allowanceAmount2"),


        /* ALLOWANCE 3 */

        allowance_date_3:
            document.getElementById(
                "allowanceDate3"
            )?.value || "",

        allowance_amount_3:
            rawValue("allowanceAmount3"),


        /* DIFFICULTY */

        difficulty:
            rawValue("difficulty"),


        /* ADDRESS */

        present_address:
            rawValue("presentAddress"),

        contact_address:
            rawValue("contactAddress"),


        /* PHONE */

        guardian_phone:
            rawValue("guardianPhone"),


        /* SIGNATURE */

        signature_date:
            document.getElementById(
                "signatureDate"
            )?.value || "",


        /* SUBMISSION */

        submission_date:
            getCurrentDate(),


        /* RESULT SHEET */

        result_sheet:
            resultSheetDataUri,

        result_sheet_filename:
            resultSheetFile
                ? resultSheetFile.name
                : "",


        /* PDF */

        pdf:
            pdfDataUri,

        fileName:
            getPDFFileName()

    };


    await fetch(
        GOOGLE_SHEETS_URL,
        {

            method: "POST",

            mode: "no-cors",

            headers: {

                "Content-Type":
                    "text/plain;charset=utf-8"

            },

            body:
                JSON.stringify(data)

        }
    );


    return true;

}


/* =========================================================
   SEND CONFIRMATION EMAIL
   ========================================================= */

async function sendConfirmationEmail() {

    const emailElement =
        document.getElementById(
            "email"
        );


    const email =
        emailElement
            ? emailElement.value.trim()
            : "";


    /*
       Email না থাকলে submission
       বন্ধ হবে না।
    */

    if (!email) {

        console.warn(
            "Email field not found or empty. EmailJS skipped."
        );

        return true;

    }


    if (
        typeof emailjs ===
        "undefined"
    ) {

        console.warn(
            "EmailJS is not loaded."
        );

        return true;

    }


    await emailjs.send(

        EMAILJS_SERVICE_ID,

        EMAILJS_TEMPLATE_ID,

        {

            name:
                rawValue("name"),

            email:
                email,

            reporting_period:
                getReportingPeriod(),

            submission_date:
                getCurrentDate(),

            file_name:
                getPDFFileName()

        }

    );


    return true;

}


/* =========================================================
   SUBMIT FORM
   ========================================================= */

if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (
                !validateForm()
            ) {

                return;

            }


            /* DISABLE BUTTONS */

            if (submitBtn) {
                submitBtn.disabled =
                    true;
            }

            if (downloadBtn) {
                downloadBtn.disabled =
                    true;
            }

            if (printBtn) {
                printBtn.disabled =
                    true;
            }


            if (successMessage) {
                successMessage.textContent =
                    "";
            }


            try {

                /* =================================================
                   STEP 1 — GENERATE PDF
                   ================================================= */

                if (submitBtn) {

                    submitBtn.innerHTML =
                        "Generating PDF...";

                }


                const pdf =
                    await generatePDF();


                const pdfDataUri =
                    pdf.output(
                        "datauristring"
                    );


                /* =================================================
                   STEP 2 — GOOGLE DRIVE + SHEET
                   ================================================= */

                if (submitBtn) {

                    submitBtn.innerHTML =
                        "Saving to Google Drive...";

                }


                await saveToGoogleSheet(
                    pdfDataUri
                );


                /* =================================================
                   STEP 3 — EMAILJS
                   ================================================= */

                if (submitBtn) {

                    submitBtn.innerHTML =
                        "Sending Confirmation...";

                }


                try {

                    await sendConfirmationEmail();

                }

                catch (emailError) {

                    /*
                       EmailJS fail করলেও
                       submission সফল থাকবে।
                    */

                    console.warn(
                        "EmailJS Error:",
                        emailError
                    );

                }


                /* =================================================
                   SUCCESS
                   ================================================= */

                if (successMessage) {

                    successMessage.textContent =
                        "✓ Form submitted successfully. PDF saved to Google Drive and response saved to Google Sheet.";

                    successMessage.style.color =
                        "#059669";

                }


                if (submitBtn) {

                    submitBtn.innerHTML =
                        "Application Submitted ✓";

                }

            }

            catch (error) {

                console.error(
                    "Submission Error:",
                    error
                );


                if (successMessage) {

                    successMessage.textContent =
                        "✕ Submission failed. Please try again.";

                    successMessage.style.color =
                        "#ef4444";

                }


                if (submitBtn) {

                    submitBtn.disabled =
                        false;

                    submitBtn.innerHTML =
                        "Submit Application →";

                }

            }


            /* ENABLE OTHER BUTTONS */

            if (downloadBtn) {

                downloadBtn.disabled =
                    false;

            }

            if (printBtn) {

                printBtn.disabled =
                    false;

            }

        }
    );

}


/* =========================================================
   INITIAL STATE
   ========================================================= */

window.addEventListener(
    "load",
    function () {

        updateAllPreview();

    }
);
