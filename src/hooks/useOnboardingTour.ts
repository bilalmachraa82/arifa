import { useEffect, useState, useCallback } from "react";
import { driver, DriveStep } from "driver.js";
import { useAuth } from "@/contexts/AuthContext";

const TOUR_COMPLETED_KEY = "arifa_onboarding_completed";

export function useOnboardingTour() {
  const { user } = useAuth();
  const [hasCompletedTour, setHasCompletedTour] = useState(true);

  useEffect(() => {
    if (user) {
      const completed = localStorage.getItem(`${TOUR_COMPLETED_KEY}_${user.id}`);
      setHasCompletedTour(completed === "true");
    }
  }, [user]);

  const completeTour = useCallback(() => {
    if (user) {
      localStorage.setItem(`${TOUR_COMPLETED_KEY}_${user.id}`, "true");
      setHasCompletedTour(true);
    }
  }, [user]);

  const resetTour = useCallback(() => {
    if (user) {
      localStorage.removeItem(`${TOUR_COMPLETED_KEY}_${user.id}`);
      setHasCompletedTour(false);
    }
  }, [user]);

  const startTour = useCallback(() => {
    const steps: DriveStep[] = [
      {
        element: '[data-tour="welcome"]',
        popover: {
          title: "Bem-vindo ao Portal de Cliente! 👋",
          description: "Vamos fazer um tour rápido pelas funcionalidades disponíveis para si.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: '[data-tour="projects"]',
        popover: {
          title: "Os Seus Projetos",
          description: "Aqui pode ver todos os seus projetos, o estado atual e acompanhar o progresso detalhado.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: '[data-tour="photos"]',
        popover: {
          title: "Galeria de Fotos",
          description: "Veja fotos do progresso da obra organizadas por fase e milestone.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: '[data-tour="documents"]',
        popover: {
          title: "Documentos",
          description: "Aceda a todos os documentos do seu projeto: plantas, contratos, orçamentos e muito mais.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: '[data-tour="messages"]',
        popover: {
          title: "Mensagens",
          description: "Comunique diretamente com a equipa ARIFA. Receberá notificações de novas mensagens.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: '[data-tour="new-message"]',
        popover: {
          title: "Nova Mensagem",
          description: "Clique aqui sempre que quiser enviar uma nova mensagem à equipa.",
          side: "left",
          align: "center",
        },
      },
    ];

    const driverObj = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      steps,
      nextBtnText: "Seguinte",
      prevBtnText: "Anterior",
      doneBtnText: "Concluir",
      progressText: "{{current}} de {{total}}",
      onDestroyed: () => {
        completeTour();
      },
    });

    driverObj.drive();
  }, [completeTour]);

  return {
    hasCompletedTour,
    startTour,
    resetTour,
    completeTour,
  };
}
