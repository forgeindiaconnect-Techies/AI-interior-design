const fs = require('fs');
const filePath = 'frontend/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldTd = `                        <td className="p-4 text-xs text-gray-600">
                          <p><strong>Bank:</strong> {req.bankDetails?.bankName}</p>
                          <p><strong>A/C:</strong> {req.bankDetails?.accountNumber}</p>
                          <p><strong>IFSC:</strong> {req.bankDetails?.ifscCode}</p>
                          <p><strong>Name:</strong> {req.bankDetails?.accountHolderName}</p>
                        </td>`;

const newTd = `                        <td className="p-4 text-xs text-gray-600">
                          <p className="font-bold text-[#1F2937] mb-1">{req.paymentMethod}</p>
                          {req.paymentMethod === 'UPI' ? (
                            <p><strong>UPI ID:</strong> {req.paymentDetails?.upiId}</p>
                          ) : (
                            <>
                              {req.paymentDetails?.bankName && <p><strong>Bank:</strong> {req.paymentDetails?.bankName}</p>}
                              <p><strong>Account:</strong> {req.paymentDetails?.accountNumber || 'N/A'}</p>
                              {req.paymentDetails?.ifscCode && <p><strong>IFSC:</strong> {req.paymentDetails?.ifscCode}</p>}
                              {req.paymentDetails?.accountHolderName && <p><strong>Name:</strong> {req.paymentDetails?.accountHolderName}</p>}
                            </>
                          )}
                          {/* Fallback for old records */}
                          {req.bankDetails?.bankName && !req.paymentMethod && (
                            <>
                              <p><strong>Bank:</strong> {req.bankDetails?.bankName}</p>
                              <p><strong>A/C:</strong> {req.bankDetails?.accountNumber}</p>
                              <p><strong>IFSC:</strong> {req.bankDetails?.ifscCode}</p>
                            </>
                          )}
                        </td>`;

content = content.replace(oldTd, newTd);
fs.writeFileSync(filePath, content, 'utf8');
console.log('AdminDashboard table updated');
