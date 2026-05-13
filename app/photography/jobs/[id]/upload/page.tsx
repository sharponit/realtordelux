import { ProtectedShell } from '@/components/auth/ProtectedShell';
import { requireOnboardedProfile } from '@/lib/auth/session';

const aiFields = ['ai_score', 'ai_selected', 'ai_category', 'sharpness_score', 'brightness_score', 'luxury_score', 'room_detected', 'image_orientation', 'publication_status'];

export default async function PhotographyUploadPage({ params }: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOnboardedProfile();
  const { id } = await params;
  const uploadedCount = 0;

  return (
    <ProtectedShell eyebrow="Photo Delivery" profile={profile} title={`Upload photos for job ${id}`}>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Delivery requirements
          </p>
          <ul className="grid gap-3 text-sm text-taupe">
            <li>Minimum 200+ photos required.</li>
            <li>RAW files required.</li>
            <li>Edited JPG files required.</li>
            <li>Drone photos required when included in the package.</li>
            <li>Twilight photos required when included in the package.</li>
          </ul>
          {uploadedCount < 200 ? (
            <div className="mt-6 border border-gold/30 bg-gold/10 p-4 text-sm leading-7 text-black/70">
              Warning: fewer than 200 images uploaded. Admin override is supported in the database.
            </div>
          ) : null}
        </section>
        <section className="border border-black/10 bg-white p-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            AI selection preparation
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {aiFields.map((field) => (
              <span className="bg-porcelain px-3 py-3 text-xs text-taupe" key={field}>{field}</span>
            ))}
          </div>
          <div className="mt-6 border border-dashed border-black/20 bg-porcelain p-8 text-center text-sm text-taupe">
            Supabase Storage upload zone placeholder. Files will be linked to photography_uploads
            with RAW/JPG/drone/twilight type metadata and future AI scoring fields.
          </div>
        </section>
      </div>
    </ProtectedShell>
  );
}
