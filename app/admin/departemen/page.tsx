'use client';

import { useEffect, useState } from 'react';
import { Department } from '@/types';
import { Card } from '@/components/ui/Card';
import { RefreshCw, Building2, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function DepartemenPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchData = () => {
    setLoading(true);
    fetch('/api/departments')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setDepartments(res.data);
          // Expand all by default
          setExpanded(new Set(res.data.map((d: Department) => d.kodeDepartemen)));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const toggleExpand = (code: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900">
            Kelola <span className="text-gold-500">Departemen & Divisi</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Struktur organisasi HMSD ITERA yang menjadi sumber dropdown form pengawasan
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} loading={loading} id="btn-refresh-dept">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Info banner */}
      <div className="bg-gold-100 border border-gold-500/40 rounded-2xl p-4">
        <div className="flex gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="font-semibold text-navy-900 text-sm">Cara mengubah data Departemen & Divisi</p>
            <p className="text-sm text-amber-800 mt-1">
              Data departemen dan divisi diambil langsung dari sheet <strong>&ldquo;Daftar Departemen & Divisi&rdquo;</strong> di Google Sheets.
              Untuk menambah, mengubah, atau menonaktifkan departemen/divisi, edit sheet tersebut secara langsung —
              perubahan akan otomatis muncul di dropdown form dalam 5 menit (cache TTL).
            </p>
          </div>
        </div>
      </div>

      {/* Departments list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Building2 className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-navy-900">Tidak ada data departemen</p>
            <p className="text-sm text-gray-500 mt-1">Periksa koneksi ke Google Sheets</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {departments.map((dept) => {
            const isOpen = expanded.has(dept.kodeDepartemen);
            return (
              <div
                key={dept.kodeDepartemen}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Dept header */}
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(dept.kodeDepartemen)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center">
                      <span className="text-gold-500 font-bold text-xs">{dept.kodeDepartemen}</span>
                    </div>
                    <div>
                      <p className="font-bold text-navy-900">{dept.namaDepartemen}</p>
                      <p className="text-xs text-gray-500">
                        {dept.divisi.length} divisi
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </button>

                {/* Divisions */}
                {isOpen && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {dept.divisi.map((div) => (
                      <div
                        key={div.kodeDivisi}
                        className="flex items-center justify-between px-5 py-3 pl-18"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-gold-500" />
                          <div>
                            <p className="text-sm font-semibold text-navy-900">{div.namaDivisi}</p>
                            <p className="text-xs text-gray-400">{div.kodeDivisi}</p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                            div.statusAktif === 'Aktif'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-gray-500 bg-gray-100 border-gray-200'
                          }`}
                        >
                          {div.statusAktif}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {!loading && departments.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-navy-900 rounded-2xl p-5 text-center">
            <p className="text-3xl font-extrabold text-white">{departments.length}</p>
            <p className="text-sky-300 text-sm font-medium">Departemen Aktif</p>
          </div>
          <div className="bg-navy-900 rounded-2xl p-5 text-center">
            <p className="text-3xl font-extrabold text-white">
              {departments.reduce((sum, d) => sum + d.divisi.length, 0)}
            </p>
            <p className="text-sky-300 text-sm font-medium">Divisi Aktif</p>
          </div>
        </div>
      )}
    </div>
  );
}
