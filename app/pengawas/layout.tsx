import Navbar from '@/components/ui/Navbar';

export default function PengawasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
    </>
  );
}
