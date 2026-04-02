import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Wallet, ArrowUpRight, ArrowDownRight, IndianRupee,
    Crown, Clock, History, Loader2, ShieldCheck, Zap
} from 'lucide-react';

export default function WalletDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'tutor') {
            navigate('/');
            return;
        }
        loadWallet();
    }, [user]);

    const loadWallet = async () => {
        try {
            const { data } = await api.get('/wallet/transactions');
            setBalance(data.data.balance);
            setTransactions(data.data.transactions);
        } catch (err) {
            console.error('Failed to load wallet:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTopUp = async (amount) => {
        const fakeUpiId = 'UPI' + Math.floor(100000 + Math.random() * 900000);
        setActionLoading('topup-' + amount);
        try {
            await api.post('/wallet/topup/upi', { amount, transactionId: fakeUpiId });
            alert(`₹${amount} Top-up Successful!`);
            loadWallet();
        } catch (err) {
            alert(err.response?.data?.message || 'Top-up failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubscribePro = async () => {
        setActionLoading('pro');
        try {
            await api.post('/wallet/subscribe-pro');
            alert('Successfully upgraded to Pro!');
            loadWallet();
        } catch (err) {
            alert(err.response?.data?.message || 'Subscription failed');
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748B' }}><Loader2 className="animate-spin" /> Loading Wallet...</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingTop: 80, paddingBottom: 60 }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>

                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Wallet size={32} color="#2563EB" /> My Wallet
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>

                    {/* Balance Card */}
                    <div style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', borderRadius: 20, padding: 32, color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.4)' }}>
                        <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.1 }}>
                            <Wallet size={150} />
                        </div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Available Credits</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 24 }}>
                                <span style={{ fontSize: 48, fontWeight: 800 }}>{balance}</span>
                                <span style={{ fontSize: 16, color: '#94A3B8', fontWeight: 600 }}>Cr</span>
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={() => handleTopUp(100)} disabled={actionLoading} style={{ background: '#3B82F6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', flex: 1 }} onMouseOver={e => e.target.style.background = '#2563EB'} onMouseOut={e => e.target.style.background = '#3B82F6'}>
                                    {actionLoading === 'topup-100' ? 'Processing...' : '+ Add 100 Cr (₹100)'}
                                </button>
                                <button onClick={() => handleTopUp(500)} disabled={actionLoading} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', flex: 1 }} onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>
                                    {actionLoading === 'topup-500' ? 'Processing...' : '+ Add 500 Cr'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pro Banner */}
                    <div style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', borderRadius: 20, padding: 32, border: '1px solid #FDE68A', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <div style={{ background: '#F59E0B', width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                <Crown size={20} />
                            </div>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#B45309', margin: 0 }}>TutorsPoint PRO</h2>
                        </div>
                        <p style={{ color: '#92400E', fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
                            Get <strong>250 Credits instantly</strong>, a Verified Gold Badge, and <strong>15-minute early access</strong> to high-value leads before free users see them!
                        </p>
                        <button onClick={handleSubscribePro} disabled={actionLoading} style={{ background: '#F59E0B', color: '#fff', border: 'none', padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'transform 0.1s' }} onMouseDown={e => e.target.style.transform = 'scale(0.98)'} onMouseUp={e => e.target.style.transform = 'scale(1)'}>
                            {actionLoading === 'pro' ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                            {actionLoading === 'pro' ? 'Upgrading...' : 'Upgrade Now for ₹199/month'}
                        </button>
                    </div>
                </div>

                {/* Transaction Ledger */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <History size={20} color="#64748B" /> Transaction History
                    </h3>

                    {transactions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                            <History size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                            <p>No transactions yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {transactions.map(txn => {
                                const isPositive = txn.amount > 0;
                                return (
                                    <div key={txn._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, border: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: isPositive ? '#DCFCE7' : '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPositive ? '#10B981' : '#EF4444' }}>
                                                {isPositive ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 15, marginBottom: 2 }}>
                                                    {txn.description || txn.type.replace(/_/g, ' ')}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
                                                    <Clock size={12} /> {formatDate(txn.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 800, fontSize: 16, color: isPositive ? '#10B981' : '#EF4444' }}>
                                                {isPositive ? '+' : ''}{txn.amount} Cr
                                            </div>
                                            <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>
                                                Bal: {txn.balanceAfter} Cr
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
