'use client';

import { useEffect, useState, useCallback } from 'react';
import { Submission, VerificationStatus } from '@/types';
import { VerificationBadge, TimeBadge, RoleBadge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatTanggalWaktu, formatTanggal } from '@/lib/utils';
import { ExternalLink, RefreshCw, Search, Filter } from 'lucide-react';

const VERIFICATION_OPTIONS: { label: string; value: VerificationStatus }[] = [
  { label: 'Belum Diperiksa', value: 'Belum Diperiksa' },
  { label: 'Sesuai', value: 'Sesuai' },
  { label: 'Perlu Revisi', value: 'Perlu Revisi' },
];

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filtered, setFiltered] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTimeStatus, setFilterTimeStatus] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Verify modal
  const [verifyModal, setVerifyModal] = useState<Submission | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<VerificationStatus>('Belum Diperiksa');
  const [verifyCatatan, setVerifyCatatan] = useState('');
  const [verifying, setVerifying] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch('/api/submission')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const all = (res.data as Submission[]).reverse();
          setSubmissions(all);
          setFiltered(all);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Apply filters
  useEffect(() => {
    let result = [...submissions];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.namaAcara.toLowerCase().includes(q) ||
          s.emailPengirim.toLowerCase().includes(q) ||
          s.departemen.toLowerCase().includes(q) ||
          s.divisi.toLowerCase().includes(q),
      );
    }
    if (filterDept) result = result.filter((s) => s.departemen === filterDept);
    if (filterStatus) result = result.filter((s) => s.statusVerifikasi === filterStatus);
    if (filterTimeStatus) result = result.filter((s) => s.statusWaktu === filterTimeStatus);
    if (filterRole) result = result.filter((s) => s.rolePengirim === filterRole);
    setFiltered(result);
  }, [submissions, searchQuery, filterDept, filterStatus, filterTimeStatus, filterRole]);

  const uniqueDepts = [...new Set(submissions.map((s) => s.departemen))].sort();

  const stats = {
    total: submissions.length,
    tepatWaktu: submissions.filter((s) => s.statusWaktu === 'Tepat Waktu').length,
    perluVerifikasi: submissions.filter((s) => s.statusVerifikasi === 'Belum Diperiksa').length,
    sesuai: submissions.filter((s) => s.statusVerifikasi === 'Sesuai').length,
  };

  const openVerifyModal = (s: Submission) => {
    setVerifyModal(s);
    setVerifyStatus(s.statusVerifikasi);
    setVerifyCatatan(s.catatanAdmin ?? '');
  };

  const handleVerify = async () => {
    if (!verifyModal) return;
    setVerifying(true);
    try {
      const res = await fetch(`/api/submission/${verifyModal.id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusVerifikasi: verifyStatus, catatanAdmin: verifyCatatan }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === verifyModal.id
              ? { ...s, statusVerifikasi: verifyStatus, catatanAdmin: verifyCatatan }
              : s,
          ),
        );
        setVerifyModal(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  const selectClass = 'border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 bg-white hover:border-gold-500 transition-colors';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900">
            Dashboard <span className="text-gold-500">Verifikasi</span>
          </h1>
          <p className="text-gray-500 mt-1">Kelola dan verifikasi semua submission pengawasan</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} loading={loading} id="btn-refresh-admin">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Submission" value={stats.total} icon="📋" />
        <StatCard title="Tepat Waktu" value={stats.tepatWaktu} icon="✅" />
        <StatCard
          title="Perlu Diperiksa"
          value={stats.perluVerifikasi}
          icon="⏳"
          description={stats.perluVerifikasi > 0 ? 'Segera ditinjau' : 'Semua sudah diperiksa'}
        />
        <StatCard title="Sesuai" value={stats.sesuai} icon="🎯" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2 text-navy-900 font-semibold text-sm mb-1">
          <Filter className="w-4 h-4 text-gold-500" />
          Filter & Pencarian
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari acara, email, departemen..."
              className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 bg-white hover:border-gold-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select title="Filter Departemen" aria-label="Filter Departemen" className={selectClass} value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
            <option value="">Semua Departemen</option>
            {uniqueDepts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <select title="Filter Status Verifikasi" aria-label="Filter Status Verifikasi" className={selectClass} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Semua Status Verifikasi</option>
            <option value="Belum Diperiksa">Belum Diperiksa</option>
            <option value="Sesuai">Sesuai</option>
            <option value="Perlu Revisi">Perlu Revisi</option>
          </select>

          <select title="Filter Status Waktu" aria-label="Filter Status Waktu" className={selectClass} value={filterTimeStatus} onChange={(e) => setFilterTimeStatus(e.target.value)}>
            <option value="">Semua Status Waktu</option>
            <option value="Tepat Waktu">Tepat Waktu</option>
            <option value="Terlambat">Terlambat</option>
          </select>
        </div>

        {/* Active filter count */}
        {(searchQuery || filterDept || filterStatus || filterTimeStatus || filterRole) && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Menampilkan <span className="font-bold text-navy-900">{filtered.length}</span> dari{' '}
              {submissions.length} submission
            </span>
            <button
              className="text-xs text-gold-500 underline font-semibold"
              onClick={() => {
                setSearchQuery(''); setFilterDept(''); setFilterStatus('');
                setFilterTimeStatus(''); setFilterRole('');
              }}
            >
              Reset filter
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-bold text-navy-900 text-lg">Tidak ada data</p>
            <p className="text-gray-500 text-sm mt-1">Coba ubah filter pencarian</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Waktu Submit', 'Pengirim', 'Departemen / Divisi', 'Acara', 'File', 'Status Waktu', 'Verifikasi', 'Aksi'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-navy-900 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {formatTanggalWaktu(s.timestampInput)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy-900 truncate max-w-[140px]">{s.emailPengirim}</p>
                      <RoleBadge role={s.rolePengirim} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy-900 text-xs">{s.departemen}</p>
                      <p className="text-gray-500 text-xs">{s.divisi}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy-900 max-w-[180px] truncate">{s.namaAcara}</p>
                      <p className="text-gray-400 text-xs">{formatTanggal(s.tanggalPelaksanaan)}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-navy-900">{s.jumlahFile}</td>
                    <td className="px-4 py-3"><TimeBadge status={s.statusWaktu} /></td>
                    <td className="px-4 py-3"><VerificationBadge status={s.statusVerifikasi} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          id={`btn-verify-${s.id}`}
                          className="px-3 py-1.5 text-xs font-semibold bg-navy-900 text-white rounded-lg hover:bg-navy-700 transition-colors"
                          onClick={() => openVerifyModal(s)}
                        >
                          Verifikasi
                        </button>
                        {s.linkFolderDrive && !s.linkFolderDrive.includes('not configured') && (
                          <a
                            href={s.linkFolderDrive}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-500 hover:text-sky-700 transition-colors"
                            aria-label="Buka Drive"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verify Modal */}
      <Modal
        isOpen={!!verifyModal}
        onClose={() => setVerifyModal(null)}
        title="Verifikasi Submission"
        size="md"
      >
        {verifyModal && (
          <div className="space-y-5">
            {/* Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <p><span className="font-semibold text-navy-900">Acara:</span> {verifyModal.namaAcara}</p>
              <p><span className="font-semibold text-navy-900">Departemen:</span> {verifyModal.departemen} → {verifyModal.divisi}</p>
              <p><span className="font-semibold text-navy-900">Pengirim:</span> {verifyModal.emailPengirim}</p>
              <p><span className="font-semibold text-navy-900">Tanggal:</span> {formatTanggal(verifyModal.tanggalPelaksanaan)}</p>
              <p><span className="font-semibold text-navy-900">Jumlah File:</span> {verifyModal.jumlahFile} file ({verifyModal.jenisBerkas})</p>
              {verifyModal.linkFolderDrive && !verifyModal.linkFolderDrive.includes('not configured') && (
                <a
                  href={verifyModal.linkFolderDrive}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sky-600 underline font-semibold"
                >
                  <ExternalLink className="w-4 h-4" /> Buka Folder Drive
                </a>
              )}
            </div>

            {/* Status select */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-navy-900">Status Verifikasi</label>
              <div className="grid grid-cols-3 gap-2">
                {VERIFICATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setVerifyStatus(opt.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border-2 transition-all ${
                      verifyStatus === opt.value
                        ? opt.value === 'Sesuai'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : opt.value === 'Perlu Revisi'
                          ? 'border-red-400 bg-red-50 text-red-700'
                          : 'border-amber-400 bg-amber-50 text-amber-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Catatan */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-navy-900">Catatan Admin (opsional)</label>
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 resize-none"
                rows={3}
                placeholder="Catatan atau instruksi revisi untuk pengawas..."
                value={verifyCatatan}
                onChange={(e) => setVerifyCatatan(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" fullWidth onClick={() => setVerifyModal(null)}>
                Batal
              </Button>
              <Button variant="primary" fullWidth loading={verifying} onClick={handleVerify} id="btn-confirm-verify">
                Simpan Verifikasi
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
