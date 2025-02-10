import { useState } from "react";

export default function TaxCalculator() {
  const [income, setIncome] = useState(0);
  const [regime, setRegime] = useState("new");
  const [deductions, setDeductions] = useState(0);
  const [hra, setHra] = useState(0);
  const [basicSalary, setBasicSalary] = useState(0);
  const [rentPaid, setRentPaid] = useState(0);
  const [isMetro, setIsMetro] = useState(false);
  const [npsDeduction, setNpsDeduction] = useState(0);
  const [homeloanInterest, setHomeloanInterest] = useState(0);
  const [tax, setTax] = useState(null);

  const calculateTax = () => {
    let hraExemption = Math.min(
      hra,
      isMetro ? 0.5 * basicSalary : 0.4 * basicSalary,
      rentPaid - 0.1 * basicSalary
    );
    let taxableIncome = regime === "old" ? Math.max(0, income - deductions - hraExemption - npsDeduction - homeloanInterest) : income;
    let taxAmount = regime === "new" ? newRegimeTax(taxableIncome) : oldRegimeTax(taxableIncome);
    let cess = taxAmount * 0.04;
    setTax(taxAmount + cess);
  };

  const newRegimeTax = (income) => {
    let tax = 0;
    income = income - 75000;
    if (income <= 400000) tax = 0;
    else if (income <= 800000) tax = (income - 400000) * 0.05;
    else if (income <= 1200000) tax = 20000 + (income - 800000) * 0.10;
    else if (income <= 1600000) tax = 60000 + (income - 1200000) * 0.15;
    else if (income <= 2000000) tax = 120000 + (income - 1600000) * 0.20;
    else if (income <= 2400000) tax = 200000 + (income - 2000000) * 0.25;
    else tax = 300000 + (income - 2400000) * 0.30;
    
    if (income <= 1200000) tax = Math.max(0, tax - 60000);
    return tax;
  };

  const oldRegimeTax = (income) => {
    let tax = 0;
    income = income - 50000;
    if (income <= 250000) return tax = 0;
    else if (income <= 500000) return tax = (income - 250000) * 0.05;
    else if (income <= 1000000) return tax = 12500 + (income - 500000) * 0.20;
    else tax = 112500 + (income - 1000000) * 0.30;
    return tax;
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4">Income Tax Calculator 2025-26</h2>
      <label className="block">Annual Income</label>
      <input type="number" value={income} onChange={(e) => setIncome(+e.target.value)} className="w-full p-2 border rounded mb-2" />
      
      <label className="block">Tax Regime</label>
      <select onChange={(e) => setRegime(e.target.value)} className="w-full p-2 border rounded mb-2">
        <option value="new">New Regime</option>
        <option value="old">Old Regime</option>
      </select><br />
      
      {regime === "old" && (
        <>
          <label className="block">Total Deductions</label>
          <input type="number" value={deductions} onChange={(e) => setDeductions(+e.target.value)} className="w-full p-2 border rounded mb-2" /><br />
          
          <label className="block">HRA Received</label>
          <input type="number" value={hra} onChange={(e) => setHra(+e.target.value)} className="w-full p-2 border rounded mb-2" /><br />
          
          <label className="block">Basic Salary</label>
          <input type="number" value={basicSalary} onChange={(e) => setBasicSalary(+e.target.value)} className="w-full p-2 border rounded mb-2" /><br />
          
          <label className="block">Rent Paid</label>
          <input type="number" value={rentPaid} onChange={(e) => setRentPaid(+e.target.value)} className="w-full p-2 border rounded mb-2" /><br />
          
          <label className="block flex items-center">
            <input type="checkbox" checked={isMetro} onChange={(e) => setIsMetro(e.target.checked)} className="mr-2" />Metro City
          </label>
          <br />
          <label className="block">NPS Deduction</label>
          <input type="number" value={npsDeduction} onChange={(e) => setNpsDeduction(+e.target.value)} className="w-full p-2 border rounded mb-2" /><br />
          
          <label className="block">Home Loan Interest Deduction</label>
          <input type="number" value={homeloanInterest} onChange={(e) => setHomeloanInterest(+e.target.value)} className="w-full p-2 border rounded mb-2" /><br />
        </>
      )}
      
      <button onClick={calculateTax} className="w-full bg-blue-500 text-white p-2 rounded">Calculate Tax</button>
      {tax !== null && <p className="mt-4 text-lg font-semibold">Total Tax Payable: ₹{tax.toFixed(2)}</p>}
    </div>
  );
}