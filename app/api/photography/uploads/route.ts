import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getUploadWarnings } from '@/lib/photography/uploads';

export async function POST(request: NextRequest) {
  const supabase = (await createSupabaseServerClient()) as any;
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  const warnings = getUploadWarnings(Number(body.image_count || 1), Boolean(body.admin_override_minimum));

  const { data, error } = await supabase
    .from('photography_uploads')
    .insert({
      photography_job_id: body.photography_job_id,
      uploaded_by: user.id,
      storage_bucket: body.storage_bucket || 'photography-deliveries',
      storage_path: body.storage_path,
      file_name: body.file_name,
      file_type: body.file_type,
      photo_category: body.photo_category,
      image_count: Number(body.image_count || 1),
      ...warnings
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ upload: data, warnings });
}
