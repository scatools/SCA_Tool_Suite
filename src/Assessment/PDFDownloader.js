import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaFilePdf } from 'react-icons/fa';

const PDFDownloader = ({rootElementId , downloadFileName}) => {

    const downloadPDFDocument = () => {
        window.print()
    }

    return <Dropdown.Item variant="dark" onClick={downloadPDFDocument}> <FaFilePdf /> &nbsp; Download as PDF</Dropdown.Item>

}

export default PDFDownloader;