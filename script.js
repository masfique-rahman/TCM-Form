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
   ADD PDF FOOTER — 2 CLEAN LINES, 5pt, NOTHING CUT OFF
   ========================================================= */

function addFooter(doc, pageNumber, totalPages) {

    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();

    const margin = 12;

    /* Two footer text lines, both safely inside the page */
    const line1Y = pageHeight - 13;
    const line2Y = pageHeight - 8;


    /* -----------------------------------------------------
       SEPARATOR LINE
       ----------------------------------------------------- */

    doc.setDrawColor(220, 225, 232);
    doc.setLineWidth(0.25);

    doc.line(
        margin,
        line1Y - 4,
        pageWidth - margin,
        line1Y - 4
    );


    /* -----------------------------------------------------
       LINE 1 (left) — org name + full address + phone
       LINE 1 (right) — developed by credit
       ----------------------------------------------------- */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.setTextColor(70, 80, 95);

    doc.text(
        "টিসিএম বাংলাদেশ  |  ২৮/১ পশ্চিম মালিবাগ, ঢাকা-১২১৭  |  ফোন: ০৯৬১৩৬১৫৬৬৬, ০৯৬১৩৬১৫৬৭৭",
        margin,
        line1Y
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5);
    doc.setTextColor(145, 155, 170);

    doc.text(
        "Developed by Masfiq Rahman Misha",
        pageWidth - margin,
        line1Y,
        { align: "right" }
    );


    /* -----------------------------------------------------
       LINE 2 (left) — website + emails
       LINE 2 (right) — page number
       ----------------------------------------------------- */

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5);
    doc.setTextColor(110, 120, 135);

    doc.text(
        "ওয়েব: info@tcmbangladesh.org  |  ইমেইল: psks_tcm@yahoo.com, shahina@tcmbangladesh.org",
        margin,
        line2Y
    );

    doc.setTextColor(145, 155, 170);

    doc.text(
        `Page ${pageNumber} of ${totalPages}`,
        pageWidth - margin,
        line2Y,
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
       MULTI PAGE
       ===================================================== */

    const footerSpace =
        22;


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

        addFooter(
            doc,
            i,
            totalPages
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
