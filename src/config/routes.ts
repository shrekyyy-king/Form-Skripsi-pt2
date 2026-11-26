export const routes = {
  home: "/",
  login: "/login",
  dashboard: {
    root: "/dashboard",
    projects: "/dashboard/projects",
    newProject: "/dashboard/projects/new",
    project: (id: string) => `/dashboard/projects/${id}`,
    builder: (id: string) => `/dashboard/builder/${id}`,
    responses: "/dashboard/responses",
    data: "/dashboard/data",
    analysis: "/dashboard/analysis",
    integrations: "/dashboard/integrations",
    settings: "/dashboard/settings",
  },
  survey: {
    intro: (slug: string) => `/survey/${slug}`,
    consent: (slug: string) => `/survey/${slug}/consent`,
    questions: (slug: string) => `/survey/${slug}/questions`,
    complete: (slug: string) => `/survey/${slug}/complete`,
  },
} as const;
