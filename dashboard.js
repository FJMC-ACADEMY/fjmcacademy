/* =====================================================
   PROTECTED PDF BUTTON
===================================================== */

.protected-pdf {
    margin-top: 15px;
}

.pdf-open-btn {
    margin-top: 8px;
    padding: 11px 20px;

    border: none;
    border-radius: 6px;

    background: #1b4332;
    color: white;

    font-size: 15px;
    font-weight: 600;

    cursor: pointer;
}

.pdf-open-btn:hover {
    background: #143d2b;
}


/* =====================================================
   PDF FULLSCREEN VIEWER
===================================================== */

#pdfFullscreen {
    position: fixed;

    inset: 0;

    width: 100vw;
    height: 100vh;

    background: #222;

    z-index: 999999999;

    display: flex;
    flex-direction: column;

    overflow: hidden;

    margin: 0;
    padding: 0;
}


/* =====================================================
   PDF HEADER
===================================================== */

.pdf-header {
    width: 100%;

    min-height: 58px;
    height: 58px;

    background: #123d28;
    color: white;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 10px;

    padding: 8px 12px;

    box-sizing: border-box;

    flex-shrink: 0;
}


/* =====================================================
   PDF TITLE
===================================================== */

.pdf-title {
    font-size: 16px;

    font-weight: 600;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;

    min-width: 0;
}


/* =====================================================
   PDF CONTROLS
===================================================== */

.pdf-controls {
    display: flex;

    align-items: center;

    gap: 7px;

    flex-shrink: 0;
}


/* =====================================================
   FULLSCREEN BUTTON
===================================================== */

.pdf-fullscreen-btn {
    border: none;

    background: #2563eb;

    color: white;

    padding: 8px 12px;

    border-radius: 5px;

    font-size: 14px;

    cursor: pointer;

    white-space: nowrap;
}


/* =====================================================
   CLOSE BUTTON
===================================================== */

.pdf-close-btn {
    border: none;

    background: #b91c1c;

    color: white;

    padding: 8px 12px;

    border-radius: 5px;

    font-size: 14px;

    cursor: pointer;

    white-space: nowrap;
}


/* =====================================================
   PDF SCROLL AREA
===================================================== */

.pdf-pages {
    flex: 1 1 auto;

    width: 100%;

    min-height: 0;

    box-sizing: border-box;

    overflow-y: scroll;

    overflow-x: auto;

    -webkit-overflow-scrolling: touch;

    overscroll-behavior: contain;

    background: #525659;

    padding: 12px;

    display: flex;

    flex-direction: column;

    align-items: center;

    gap: 12px;

    user-select: none;
    -webkit-user-select: none;

    touch-action: pan-y;
}


/* =====================================================
   EACH PDF PAGE
===================================================== */

.pdf-page {
    background: white;

    display: block;

    position: relative;

    flex: 0 0 auto;

    width: fit-content;

    max-width: none;

    height: auto;

    line-height: 0;

    box-shadow:
        0 2px 12px rgba(0,0,0,0.35);

    user-select: none;
    -webkit-user-select: none;
}


/* =====================================================
   PDF CANVAS
===================================================== */

.pdf-page canvas {
    display: block;

    margin: 0;
    padding: 0;

    max-width: none;

    height: auto;

    user-select: none;
    -webkit-user-select: none;

    -webkit-touch-callout: none;

    pointer-events: none;
}


/* =====================================================
   LOADING
===================================================== */

.pdf-loading {
    color: white;

    font-size: 18px;

    padding: 50px 20px;

    text-align: center;
}


/* =====================================================
   ERROR
===================================================== */

.pdf-error {
    color: white;

    text-align: center;

    padding: 60px 20px;
}


/* =====================================================
   MOBILE PDF
===================================================== */

@media (max-width: 600px) {

    #pdfFullscreen {
        width: 100vw;
        height: 100dvh;
    }


    .pdf-header {
        min-height: 54px;
        height: 54px;

        padding: 7px 8px;
    }


    .pdf-title {
        font-size: 14px;
    }


    .pdf-controls {
        gap: 5px;
    }


    .pdf-fullscreen-btn,
    .pdf-close-btn {
        padding: 7px 9px;

        font-size: 12px;
    }


    .pdf-pages {
        padding: 6px;

        gap: 8px;

        overflow-y: scroll;
        overflow-x: auto;

        -webkit-overflow-scrolling: touch;

        touch-action: pan-y;
    }


    .pdf-page {
        flex-shrink: 0;

        width: fit-content;

        max-width: none;
    }


    .pdf-page canvas {
        max-width: none;
    }

}
