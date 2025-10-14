import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/asistencia",
      name: "asistencia",
      component: () => import("@/views/AsistenciaView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("@/views/AdminView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/registro-personal",
      name: "registro-personal",
      component: () => import("@/views/RegistroPersonalView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/gestion-horarios",
      name: "gestion-horarios",
      component: () => import("@/views/GestionHorariosView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/editar-empleado/:id",
      name: "editar-empleado",
      component: () => import("@/views/EditarEmpleadoView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/");
  } 
  // Si la ruta requiere admin y el usuario no es admin
  else if (to.meta.requiresAdmin && authStore.user?.role !== "admin") {
    // Redirigir a asistencia si no es admin
    next("/asistencia");
  } 
  // Si está en login y ya está autenticado, redirigir según su rol
  else if (to.path === "/" && authStore.isAuthenticated) {
    if (authStore.user?.role === "admin") {
      next("/admin");
    } else {
      next("/asistencia");
    }
  }
  // En cualquier otro caso, permitir la navegación
  else {
    next();
  }
});

export default router;