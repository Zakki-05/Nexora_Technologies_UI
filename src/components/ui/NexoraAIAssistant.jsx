import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  CalendarDays,
  IndianRupee,
  Clock,
  HelpCircle,
  FileText,
  Shield,
  Trash2,
  Check,
} from 'lucide-react';

export const NexoraAIAssistant = () => {
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const employeeName = user?.employee?.full_name || user?.username || 'Team Member';
  const roleName = user?.role || 'EMPLOYEE';

  useEffect(() => {
    // Initial welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: 'ai',
          text: `Hello ${employeeName}! 👋 I am **Nexora AI Copilot**, your enterprise HR and workforce assistant. How can I help you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const quickPrompts = [
    { label: '🏖️ Leave Balances & Rules', query: 'What are the company leave policies and quota allocations?' },
    { label: '💰 EPF & ESIC Deduction Math', query: 'How are statutory EPF, ESIC, and take-home salary calculated?' },
    { label: '⚖️ Gratuity & Maternity Law', query: 'What are the statutory rules for Gratuity and Maternity Benefits in India?' },
    { label: '🏢 SaaS Plans & Enterprise Quota', query: 'What are the subscription tiers and feature entitlements for Nexora Workforce?' },
    { label: '⏱️ Working Hours & Shift Rules', query: 'What is the daily shift duration, grace period, and punch-in rule?' },
    { label: '🧾 Submit Expense Reimbursement', query: 'How do I claim reimbursement for business travel or equipment?' },
  ];

  const handleSend = (textToSend = input) => {
    const query = textToSend.trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const responseText = generateSmartResponse(query, user, isAdmin);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 600);
  };

  const generateSmartResponse = (q, currentUser, adminFlag) => {
    const lower = q.toLowerCase();

    if (lower.includes('gratuity') || lower.includes('maternity') || lower.includes('law') || lower.includes('benefit')) {
      return (
        `### ⚖️ Indian Statutory Labor Law Compliance\n\n` +
        `* **Payment of Gratuity Act, 1972:**\n` +
        `  * Eligibility: Minimum **5 years** of continuous service.\n` +
        `  * Formula: \\( \\frac{15 \\times \\text{Last Drawn Basic} \\times \\text{Tenure (Years)}}{26} \\)\n` +
        `  * Tax-Free Exemption Cap: Up to ₹20,000,000 (20 Lakhs INR).\n\n` +
        `* **Maternity Benefit (Amendment) Act, 2017:**\n` +
        `  * Entitlement: **26 weeks (180 days)** of fully paid maternity leave for up to two surviving children.\n` +
        `  * Work-from-Home Option: Mutually agreed hybrid allowance upon completion of leave period.\n` +
        `  * Crèche / Childcare: Mandated for establishments with 50+ employees.`
      );
    }

    if (lower.includes('plan') || lower.includes('tier') || lower.includes('quota') || lower.includes('subscription') || lower.includes('saas') || lower.includes('pricing')) {
      return (
        `### 🏢 Nexora Workforce 2.0 — Commercial SaaS Tiers\n\n` +
        `* **Community Free (₹0/mo):** Up to 15 employees, single session punch, basic leave ledgers.\n` +
        `* **Growth Starter (₹2,999/mo):** Up to 50 employees, multi-session clock, EPF/ESIC payroll, document storage.\n` +
        `* **Business Pro (₹7,999/mo):** Up to 250 employees, Interactive Org Chart, Expense Reimbursements, RBAC, 1-Click Excel.\n` +
        `* **Enterprise Unlimited (₹19,999/mo):** Unlimited employees, Multi-Tenant Scoping, 24/7 Nexora AI, PWA & Native Mobile App.\n\n` +
        `🏛️ **Active Tenant:** **Nexora Technologies Inc.** is running on **Enterprise Unlimited** with multi-tenant data isolation.`
      );
    }

    if (lower.includes('leave') || lower.includes('casual') || lower.includes('sick') || lower.includes('vacation')) {
      return (
        `### 🏖️ Corporate Leave Policies (10 Quota Ledgers)\n\n` +
        `At **Nexora Technologies**, your annual entitlement includes:\n` +
        `* **Annual / Earned Leave:** 15–25 days (encashable / carry-forward enabled)\n` +
        `* **Sick & Casual Leave:** 10 days each (immediate self-service application)\n` +
        `* **Maternity / Paternity:** 180 days paid (maternity) / 15 days (paternity)\n` +
        `* **Bereavement & Marriage:** 5 days statutory compassionate leave\n\n` +
        `👉 **To apply:** Navigate to **Apply for Leave** in the sidebar, select dates, and submit for direct HR approval.`
      );
    }

    if (lower.includes('epf') || lower.includes('esic') || lower.includes('salary') || lower.includes('pay') || lower.includes('tax')) {
      return (
        `### 💰 Indian Statutory Payroll Calculation\n\n` +
        `Your salary breakdown is calculated automatically on the server:\n` +
        `1. **Basic Salary:** 40%–50% of Gross CTC\n` +
        `2. **Employee Provident Fund (EPF):** Exactly **12%** of Basic Salary\n` +
        `3. **ESIC Contribution:** **0.75%** employee share, **3.25%** employer share (applicable if Gross ≤ ₹21,000/mo)\n` +
        `4. **Professional Tax (PT):** ₹200/mo statutory standard\n` +
        `5. **Loss of Pay (LOP):** Automatically deducted per unapproved absence\n\n` +
        `👉 You can download your official **Cryptographically Timestamped Payslip PDF** under **My Salary & Slips**.`
      );
    }

    if (lower.includes('attendance') || lower.includes('punch') || lower.includes('shift') || lower.includes('hour') || lower.includes('time')) {
      return (
        `### ⏱️ Attendance & Punctuality Policy\n\n` +
        `* **Standard Working Day:** 9 Hours (inclusive of 60 minutes authorized lunch & break time)\n` +
        `* **Check-In Window:** Shift starts at 09:30 AM (15-minute grace period until 09:45 AM)\n` +
        `* **Punctuality Flags:** Check-in after 09:45 AM is logged as **LATE**; leaving before completing 8 hours is flagged as **HALF_DAY**\n` +
        `* **Live Break Tracker:** Use the **Take a Break** button on your dashboard to log coffee and meal intervals accurately.`
      );
    }

    if (lower.includes('holiday') || lower.includes('calendar') || lower.includes('off')) {
      return (
        `### 🗓️ Upcoming Corporate Holidays\n\n` +
        `* **New Year's Day:** January 1 (National)\n` +
        `* **Republic Day:** January 26 (Gazetted)\n` +
        `* **Labor Day / May Day:** May 1\n` +
        `* **Independence Day:** August 15\n` +
        `* **Gandhi Jayanti:** October 2\n` +
        `* **Diwali / Deepavali:** Festival Holidays (2 Days)\n` +
        `* **Christmas:** December 25\n\n` +
        `👉 View the full holiday calendar anytime under **Company Holidays** in the navigation menu.`
      );
    }

    if (lower.includes('reimbursement') || lower.includes('expense') || lower.includes('claim') || lower.includes('bill')) {
      return (
        `### 🧾 Expense Reimbursement Process\n\n` +
        `You can claim reimbursement for authorized business expenses:\n` +
        `* **Categories:** Travel & Fuel, Client Meals, Equipment & Hardware, Software & Broadband, Training & Certifications\n` +
        `* **Requirements:** Invoice/Bill reference and business justification\n` +
        `* **Settlement:** Approved amounts are credited directly to your bank account with the monthly payroll cycle.\n\n` +
        `👉 Open **My Expense Claims** to file a new claim in under 60 seconds.`
      );
    }

    if (lower.includes('who are you') || lower.includes('what can you do') || lower.includes('help')) {
      return (
        `I am your **Nexora Enterprise Copilot**!\n\n` +
        `I can help you with:\n` +
        `* 📊 Checking leave policies and attendance rules\n` +
        `* 💵 Understanding Indian EPF, ESIC, and salary deductions\n` +
        `* 🗓️ Viewing holidays and department roster schedules\n` +
        `* 📑 Guiding you on document uploads and photo verification\n` +
        `* 💼 Answering questions about employee rights and HR approvals`
      );
    }

    // Default intelligent fallback
    return (
      `Regarding **"${q}"**:\n\n` +
      `Our corporate policy adheres to standard enterprise compliance. ` +
      `For specific assistance, you can submit an internal query to **Human Resources** via the **Broadcasts / Support** portal, or contact System Administration directly at **zakkiadnan05@gmail.com**.`
    );
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold shadow-2xl hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300 cursor-pointer border border-emerald-400/40 group"
          title="Open Nexora AI HR Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span className="text-xs tracking-wide font-extrabold pr-0.5">Nexora AI</span>
        </button>
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
                <Bot className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-sm text-white">Nexora AI Copilot</h4>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400">Enterprise Workforce &amp; HR Assistant</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Chips Strip */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition-colors shrink-0 shadow-2xs"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <div className="space-y-1 whitespace-pre-wrap leading-relaxed">
                    {m.text}
                  </div>
                  <div
                    className={`text-[9px] mt-1.5 text-right ${
                      m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 rounded-bl-xs flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask about policies, EPF, leave quotas, shifts..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-colors cursor-pointer shrink-0 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
