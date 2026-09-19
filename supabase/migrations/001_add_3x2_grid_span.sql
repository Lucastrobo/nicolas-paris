alter table public.project_images
  drop constraint if exists project_images_grid_span_check;

alter table public.project_images
  add constraint project_images_grid_span_check
  check (grid_span in ('1x1', '1x2', '2x1', '2x2', '3x2'));
