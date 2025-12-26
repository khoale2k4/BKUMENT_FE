export const AppRoute = {
  onboard: "/",
  login: '/login',
  register: '/register',
  forgot_password: "/forgot-password",
  home: '/home',
  library: '/library',
  profile: '/profile',
  courses: '/courses',
  blogs: {
    my: "/blogs",
    write: "/blogs/write",
    id: (id: string) => `/blogs/${id}`,
  },
  documents: {
    my: "/documents",
    upload: "/documents/upload",
    id: (id: string) => `/documents/${id}`
  },
  messages: '/messages',
  tutors: '/tutors',
  notifications: '/notifications',
  settings: "/settings",
};
