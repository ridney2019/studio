"use client";

import ServiceFunnelPage from "@/app/components/ServiceFunnelPage";
import { useTranslation } from "@/app/hooks/useTranslation";

export default function NewTattooPage() {
  const { t, isHydrated } = useTranslation();

  if (!isHydrated) return null;

  return (
    <ServiceFunnelPage
      content={{
        serviceLabel: t("newServiceLabel"),
        hookTitle: t("newHookTitle"),
        hookDescription: t("newHookDescription"),
        hookPromise: t("newHookPromise"),
        awarenessTitle: t("newAwarenessTitle"),
        awarenessItems: [
          t("newAwarenessItem1"),
          t("newAwarenessItem2"),
          t("newAwarenessItem3"),
        ],
        painTitle: t("newPainTitle"),
        painItems: [
          t("newPainItem1"),
          t("newPainItem2"),
          t("newPainItem3"),
        ],
        fearTitle: t("newFearTitle"),
        fearLead: t("newFearLead"),
        fearItems: [
          t("newFearItem1"),
          t("newFearItem2"),
          t("newFearItem3"),
        ],
        authorityTitle: t("newAuthorityTitle"),
        authorityDescription: t("newAuthorityDescription"),
        authorityProof: [
          t("newAuthorityProof1"),
          t("newAuthorityProof2"),
          t("newAuthorityProof3"),
        ],
        solutionTitle: t("newSolutionTitle"),
        solutionLead: t("newSolutionLead"),
        processSteps: [
          {
            title: t("newStep1Title"),
            description: t("newStep1Description"),
          },
          {
            title: t("newStep2Title"),
            description: t("newStep2Description"),
          },
          {
            title: t("newStep3Title"),
            description: t("newStep3Description"),
          },
          {
            title: t("newStep4Title"),
            description: t("newStep4Description"),
          },
          {
            title: t("newStep5Title"),
            description: t("newStep5Description"),
          },
        ],
        comparisonBlocks: [
          {
            title: t("newCompareBlock1Title"),
            intro: t("newCompareBlock1Intro"),
            slides: [
              {
                label: t("newCompareBlock1Slide1Label"),
                caption: t("newCompareBlock1Slide1Caption"),
                imageSrc: "/artists/felipe-santos.jpg",
                imageAlt: t("newCompareBlock1Slide1Alt"),
              },
              {
                label: t("newCompareBlock1Slide2Label"),
                caption: t("newCompareBlock1Slide2Caption"),
                imageSrc: "/artists/adrian.svg",
                imageAlt: t("newCompareBlock1Slide2Alt"),
              },
            ],
          },
          {
            title: t("newCompareBlock2Title"),
            intro: t("newCompareBlock2Intro"),
            slides: [
              {
                label: t("newCompareBlock2Slide1Label"),
                caption: t("newCompareBlock2Slide1Caption"),
                imageSrc: "/artists/zee.svg",
                imageAlt: t("newCompareBlock2Slide1Alt"),
              },
              {
                label: t("newCompareBlock2Slide2Label"),
                caption: t("newCompareBlock2Slide2Caption"),
                imageSrc: "/artists/victor.svg",
                imageAlt: t("newCompareBlock2Slide2Alt"),
              },
            ],
          },
          {
            title: t("newCompareBlock3Title"),
            intro: t("newCompareBlock3Intro"),
            slides: [
              {
                label: t("newCompareBlock3Slide1Label"),
                caption: t("newCompareBlock3Slide1Caption"),
                imageSrc: "/artists/felipe-santos.jpg",
                imageAlt: t("newCompareBlock3Slide1Alt"),
              },
              {
                label: t("newCompareBlock3Slide2Label"),
                caption: t("newCompareBlock3Slide2Caption"),
                imageSrc: "/artists/jay-shin.svg",
                imageAlt: t("newCompareBlock3Slide2Alt"),
              },
              {
                label: t("newCompareBlock3Slide3Label"),
                caption: t("newCompareBlock3Slide3Caption"),
                imageSrc: "/artists/adrian.svg",
                imageAlt: t("newCompareBlock3Slide3Alt"),
              },
            ],
          },
        ],
        scarcityTitle: t("newScarcityTitle"),
        scarcityDescription: t("newScarcityDescription"),
        scarcityItems: [
          t("newScarcityItem1"),
          t("newScarcityItem2"),
          t("newScarcityItem3"),
        ],
        formCta: t("newFormCta"),
        formHelper: t("newFormHelper"),
      }}
    />
  );
}
