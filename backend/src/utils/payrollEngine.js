const calculatePayroll2024 = (baseSalary, allowances, taxCategory) => {
    const gross = baseSalary + allowances;
    const bpjsKesehatan = Math.min(gross, 12000000) * 0.01;
    const bpjsKetenagakerjaan = gross * 0.03;
    const totalBPJS = bpjsKesehatan + bpjsKetenagakerjaan;
    let terRate = 0;
    if (taxCategory === "A") {
        if (gross <= 5400000) terRate = 0; else if (gross <= 6000000) terRate = 0.0025; else terRate = 0.05;
    } else {
        terRate = 0.06;
    }
    const pph21Tax = gross * terRate;
    const netSalary = gross - totalBPJS - pph21Tax;
    return { gross, totalBPJS, pph21Tax, netSalary };
};
module.exports = { calculatePayroll2024 };