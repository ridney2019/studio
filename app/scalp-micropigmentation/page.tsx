"use client";

import ServiceFunnelPage from "@/app/components/ServiceFunnelPage";
import { useTranslation } from "@/app/hooks/useTranslation";

export default function ScalpMicropigmentationPage() {
  const { t, isHydrated } = useTranslation();

  if (!isHydrated) return null;

  return (
    <ServiceFunnelPage
      content={{
        serviceLabel: t("scalpServiceLabel"),
        hookTitle: t("scalpHookTitle"),
        hookDescription: t("scalpHookDescription"),
        hookPromise: t("scalpHookPromise"),
        awarenessTitle: t("scalpAwarenessTitle"),
        awarenessItems: [
          t("scalpAwarenessItem1"),
          t("scalpAwarenessItem2"),
          t("scalpAwarenessItem3"),
        ],
        painTitle: t("scalpPainTitle"),
        painItems: [
          t("scalpPainItem1"),
          t("scalpPainItem2"),
          t("scalpPainItem3"),
        ],
        fearTitle: t("scalpFearTitle"),
        fearLead: t("scalpFearLead"),
        fearItems: [
          t("scalpFearItem1"),
          t("scalpFearItem2"),
          t("scalpFearItem3"),
        ],
        authorityTitle: t("scalpAuthorityTitle"),
        authorityDescription: t("scalpAuthorityDescription"),
        authorityProof: [
          t("scalpAuthorityProof1"),
          t("scalpAuthorityProof2"),
          t("scalpAuthorityProof3"),
        ],
        solutionTitle: t("scalpSolutionTitle"),
        solutionLead: t("scalpSolutionLead"),
        processSteps: [
          {
            title: t("scalpStep1Title"),
            description: t("scalpStep1Description"),
          },
          {
            title: t("scalpStep2Title"),
            description: t("scalpStep2Description"),
          },
          {
            title: t("scalpStep3Title"),
            description: t("scalpStep3Description"),
          },
          {
            title: t("scalpStep4Title"),
            description: t("scalpStep4Description"),
          },
          {
            title: t("scalpStep5Title"),
            description: t("scalpStep5Description"),
          },
        ],
        comparisonBlocks: [
          {
            title: t("scalpCompareBlock1Title"),
            intro: t("scalpCompareBlock1Intro"),
            slides: [
              {
                label: t("scalpCompareBlock1Slide1Label"),
                caption: t("scalpCompareBlock1Slide1Caption"),
                imageSrc: "/artists/felipe-santos.jpg",
                imageAlt: t("scalpCompareBlock1Slide1Alt"),
              },
              {
                label: t("scalpCompareBlock1Slide2Label"),
                caption: t("scalpCompareBlock1Slide2Caption"),
                imageSrc: "/artists/victor.svg",
                imageAlt: t("scalpCompareBlock1Slide2Alt"),
              },
            ],
          },
          {
            title: t("scalpCompareBlock2Title"),
            intro: t("scalpCompareBlock2Intro"),
            slides: [
              {
                label: t("scalpCompareBlock2Slide1Label"),
                caption: t("scalpCompareBlock2Slide1Caption"),
                imageSrc: "/artists/zee.svg",
                imageAlt: t("scalpCompareBlock2Slide1Alt"),
              },
              {
                label: t("scalpCompareBlock2Slide2Label"),
                caption: t("scalpCompareBlock2Slide2Caption"),
                imageSrc: "/artists/adrian.svg",
                imageAlt: t("scalpCompareBlock2Slide2Alt"),
              },
            ],
          },
          {
            title: t("scalpCompareBlock3Title"),
            intro: t("scalpCompareBlock3Intro"),
            slides: [
              {
                label: t("scalpCompareBlock3Slide1Label"),
                caption: t("scalpCompareBlock3Slide1Caption"),
                imageSrc: "/artists/felipe-santos.jpg",
                imageAlt: t("scalpCompareBlock3Slide1Alt"),
              },
              {
                label: t("scalpCompareBlock3Slide2Label"),
                caption: t("scalpCompareBlock3Slide2Caption"),
                imageSrc: "/artists/jay-shin.svg",
                imageAlt: t("scalpCompareBlock3Slide2Alt"),
              },
              {
                label: t("scalpCompareBlock3Slide3Label"),
                caption: t("scalpCompareBlock3Slide3Caption"),
                imageSrc: "/artists/victor.svg",
                imageAlt: t("scalpCompareBlock3Slide3Alt"),
              },
            ],
          },
        ],
        scarcityTitle: t("scalpScarcityTitle"),
        scarcityDescription: t("scalpScarcityDescription"),
        scarcityItems: [
          t("scalpScarcityItem1"),
          t("scalpScarcityItem2"),
          t("scalpScarcityItem3"),
        ],
        formCta: t("scalpFormCta"),
        formHelper: t("scalpFormHelper"),
      }}
    />
  );
}
