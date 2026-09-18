const calculatePayroll2024 = (baseSalary, allowances, taxCategory) => {
    const gross = baseSalary + allowances;
    const bpjsKesehatan = Math.min(gross, 12000000) * 0.01;
    const bpjsKetenagakerjaan = gross * 0.03;
    const totalBPJS = bpjsKesehatan + bpjsKetenagakerjaan;
    let terRate = (taxCategory === "A") ? 0.05 : 0.06;
    const pph21Tax = gross * terRate;
    const netSalary = gross - totalBPJS - pph21Tax;
    return { gross, totalBPJS, pph21Tax, netSalary };
};
module.exports = { calculatePayroll2024 };