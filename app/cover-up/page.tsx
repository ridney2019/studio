"use client";

import ServiceFunnelPage from "@/app/components/ServiceFunnelPage";
import { useTranslation } from "@/app/hooks/useTranslation";

export default function CoverUpPage() {
  const { t, isHydrated } = useTranslation();

  if (!isHydrated) return null;

  return (
    <ServiceFunnelPage
      content={{
        serviceLabel: t("coverServiceLabel"),
        hookTitle: t("coverHookTitle"),
        hookDescription: t("coverHookDescription"),
        hookPromise: t("coverHookPromise"),
        awarenessTitle: t("coverAwarenessTitle"),
        awarenessItems: [
          t("coverAwarenessItem1"),
          t("coverAwarenessItem2"),
          t("coverAwarenessItem3"),
        ],
        painTitle: t("coverPainTitle"),
        painItems: [
          t("coverPainItem1"),
          t("coverPainItem2"),
          t("coverPainItem3"),
        ],
        fearTitle: t("coverFearTitle"),
        fearLead: t("coverFearLead"),
        fearItems: [
          t("coverFearItem1"),
          t("coverFearItem2"),
          t("coverFearItem3"),
        ],
        authorityTitle: t("coverAuthorityTitle"),
        authorityDescription: t("coverAuthorityDescription"),
        authorityProof: [
          t("coverAuthorityProof1"),
          t("coverAuthorityProof2"),
          t("coverAuthorityProof3"),
        ],
        solutionTitle: t("coverSolutionTitle"),
        solutionLead: t("coverSolutionLead"),
        processSteps: [
          {
            title: t("coverStep1Title"),
            description: t("coverStep1Description"),
          },
          {
            title: t("coverStep2Title"),
            description: t("coverStep2Description"),
          },
          {
            title: t("coverStep3Title"),
            description: t("coverStep3Description"),
          },
          {
            title: t("coverStep4Title"),
            description: t("coverStep4Description"),
          },
          {
            title: t("coverStep5Title"),
            description: t("coverStep5Description"),
          },
        ],
        comparisonBlocks: [
          {
            title: t("coverCompareBlock1Title"),
            intro: t("coverCompareBlock1Intro"),
            slides: [
              {
                label: t("coverCompareBlock1Slide1Label"),
                caption: t("coverCompareBlock1Slide1Caption"),
                imageSrc: "/artists/felipe-santos.jpg",
                imageAlt: t("coverCompareBlock1Slide1Alt"),
              },
              {
                label: t("coverCompareBlock1Slide2Label"),
                caption: t("coverCompareBlock1Slide2Caption"),
                imageSrc: "/artists/victor.svg",
                imageAlt: t("coverCompareBlock1Slide2Alt"),
              },
            ],
          },
          {
            title: t("coverCompareBlock2Title"),
            intro: t("coverCompareBlock2Intro"),
            slides: [
              {
                label: t("coverCompareBlock2Slide1Label"),
                caption: t("coverCompareBlock2Slide1Caption"),
                imageSrc: "/artists/zee.svg",
                imageAlt: t("coverCompareBlock2Slide1Alt"),
              },
              {
                label: t("coverCompareBlock2Slide2Label"),
                caption: t("coverCompareBlock2Slide2Caption"),
                imageSrc: "/artists/adrian.svg",
                imageAlt: t("coverCompareBlock2Slide2Alt"),
              },
            ],
          },
          {
            title: t("coverCompareBlock3Title"),
            intro: t("coverCompareBlock3Intro"),
            slides: [
              {
                label: t("coverCompareBlock3Slide1Label"),
                caption: t("coverCompareBlock3Slide1Caption"),
                imageSrc: "/artists/felipe-santos.jpg",
                imageAlt: t("coverCompareBlock3Slide1Alt"),
              },
              {
                label: t("coverCompareBlock3Slide2Label"),
                caption: t("coverCompareBlock3Slide2Caption"),
                imageSrc: "/artists/jay-shin.svg",
                imageAlt: t("coverCompareBlock3Slide2Alt"),
              },
              {
                label: t("coverCompareBlock3Slide3Label"),
                caption: t("coverCompareBlock3Slide3Caption"),
                imageSrc: "/artists/victor.svg",
                imageAlt: t("coverCompareBlock3Slide3Alt"),
              },
            ],
          },
        ],
        scarcityTitle: t("coverScarcityTitle"),
        scarcityDescription: t("coverScarcityDescription"),
        scarcityItems: [
          t("coverScarcityItem1"),
          t("coverScarcityItem2"),
          t("coverScarcityItem3"),
        ],
        formCta: t("coverFormCta"),
        formHelper: t("coverFormHelper"),
      }}
    />
  );
}
