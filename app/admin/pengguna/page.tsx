'use client';

import { useEffect, useState } from 'react';
import { AppUser } from '@/types';
import { RoleBadge, StatusActiveBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatTanggal } from '@/lib/utils';
import { Plus, RefreshCw, Search, Users } from 'lucide-react';

const EMPTY_USER: Omit<AppUser, 'tanggalTerdaftar'> = {
  email: '',
  namaLengkap: '',
  role: 'Pengawas',
  departemenDivisi: '',
  statusAktif: 'Aktif',
};

export default function PenggunaPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [filtered, setFiltered] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<AppUser | null>(null);
  const [formData, setFormData] = useState<typeof EMPTY_USER>({ ...EMPTY_USER });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchData = () => {
    setLoading(true);
    fetch('/api/users')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setUsers(res.data);
          setFiltered(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!search) { setFiltered(users); return; }
    const q = search.toLowerCase();
    setFiltered(users.filter((u) =>
      u.email.toLowerCase().includes(q) || u.namaLengkap.toLowerCase().includes(q),
    ));
  }, [search, users]);

  const openAdd = () => {
    setFormData({ ...EMPTY_USER });
    setFormError('');
    setAddModal(true);
  };

  const openEdit = (user: AppUser) => {
    setFormData({
      email: user.email,
      namaLengkap: user.namaLengkap,
      role: user.role,
      departemenDivisi: user.departemenDivisi ?? '',
      statusAktif: user.statusAktif,
    });
    setFormError('');
    setEditModal(user);
  };

  const handleAdd = async () => {
    if (!formData.email || !formData.namaLengkap) {
      setFormError('Email dan Nama Lengkap wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setAddModal(false);
      } else {
        setFormError(data.error ?? 'Gagal menyimpan');
      }
    } catch { setFormError('Gagal menghubungi server'); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!editModal) return;
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, email: editModal.email }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setEditModal(null);
      } else {
        setFormError(data.error ?? 'Gagal menyimpan');
      }
    } catch { setFormError('Gagal menghubungi server'); }
    finally { setSaving(false); }
  };

  const inputClass = 'w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 bg-white';

  const UserForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-navy-900 mb-1">Email <span className="text-red-500">*</span></label>
        <input
          type="email"
          className={inputClass}
          value={formData.email}
          onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
          disabled={!!editModal}
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-navy-900 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
        <input
          type="text"
          className={inputClass}
          value={formData.namaLengkap}
          onChange={(e) => setFormData((f) => ({ ...f, namaLengkap: e.target.value }))}
          placeholder="Nama Lengkap"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-1">Role</label>
          <select
            title="Pilih Role"
            aria-label="Pilih Role"
            className={inputClass}
            value={formData.role}
            onChange={(e) => setFormData((f) => ({ ...f, role: e.target.value as AppUser['role'] }))}
          >
            <option value="Pengawas">Pengawas</option>
            <option value="Master Admin">Master Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-1">Status</label>
          <select
            title="Pilih Status Aktif"
            aria-label="Pilih Status Aktif"
            className={inputClass}
            value={formData.statusAktif}
            onChange={(e) => setFormData((f) => ({ ...f, statusAktif: e.target.value as AppUser['statusAktif'] }))}
          >
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>
      {formError && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{formError}</p>}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900">
            Kelola <span className="text-gold-500">Pengguna</span>
          </h1>
          <p className="text-gray-500 mt-1">Daftar akun yang dapat mengakses sistem</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} loading={loading} id="btn-refresh-users">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="accent" size="sm" onClick={openAdd} id="btn-add-user">
            <Plus className="w-4 h-4" /> Tambah Pengguna
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari email atau nama..."
          className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <Users className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-navy-900">Tidak ada pengguna</p>
          </div>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Email', 'Nama', 'Role', 'Status', 'Terdaftar', 'Aksi'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-navy-900">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u.email} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-navy-900">{u.email}</td>
                    <td className="px-4 py-3 text-gray-700">{u.namaLengkap}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3"><StatusActiveBadge status={u.statusAktif} /></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {u.tanggalTerdaftar ? formatTanggal(u.tanggalTerdaftar) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEdit(u)}
                        className="px-3 py-1.5 text-xs font-semibold border-2 border-navy-900 text-navy-900 rounded-lg hover:bg-navy-900 hover:text-white transition-all"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Tambah Pengguna Baru">
        <div className="space-y-5">
          <UserForm />
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setAddModal(false)}>Batal</Button>
            <Button variant="primary" fullWidth loading={saving} onClick={handleAdd} id="btn-save-user">
              Simpan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title="Edit Pengguna">
        <div className="space-y-5">
          <UserForm />
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setEditModal(null)}>Batal</Button>
            <Button variant="primary" fullWidth loading={saving} onClick={handleEdit} id="btn-update-user">
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
