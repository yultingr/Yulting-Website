import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { skills } from "@/data/skills";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Yulting Rinpoche — educator, translator, and Buddhist scholar at Gaden Shartse Monastery.",
};

export default function AboutPage() {
  return (
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight">About Me</h1>
        <div className="mt-8 space-y-6 text-neutral-700 leading-7 dark:text-neutral-300">
          <p>
            A recognized reincarnated Tulku, born in Nepal in 1994, with a
            distinguished background in Buddhist philosophy, education, and
            translation. Adept in both traditional and contemporary educational
            settings, with a proven record of excellence in monastic studies and
            cross-cultural communication.
          </p>
          <p>
            Currently pursuing the Great Gelug Examination (Geshe Lharampa, PhD)
            at Gaden Shartse Monastery while serving as an educator and
            translator, committed to the dissemination of Buddhist teachings and
            the integration of contemplative practice with modern science.
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          Work Experience
        </h2>
        <div className="mt-6 space-y-8">
          <div className="border-l-2 border-neutral-200 pl-4 dark:border-neutral-800">
            <h3 className="font-medium">
              English-Tibetan Translation Class Teacher
            </h3>
            <p className="text-sm text-neutral-500">
              Gaden Shartse School, India &middot; 2022 &ndash; Present
            </p>
            <ul className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                Responsible for teaching English-Tibetan translation classes for
                the past four years
              </li>
              <li>
                Facilitates the development of translation proficiency to support
                monastic education and intercultural understanding
              </li>
            </ul>
          </div>

          <div className="border-l-2 border-neutral-200 pl-4 dark:border-neutral-800">
            <h3 className="font-medium">Spiritual Teacher</h3>
            <p className="text-sm text-neutral-500">
              Gaden Shartse School, India &middot; 2017 &ndash; 2021
            </p>
            <ul className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                Conducted formal teachings in Buddhist philosophy and
                contemplative practice
              </li>
              <li>
                Provided spiritual guidance and mentorship to students,
                contributing to their academic and personal growth
              </li>
            </ul>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          International Engagements
        </h2>
        <div className="mt-6 space-y-6">
          <div className="border-l-2 border-neutral-200 pl-4 dark:border-neutral-800">
            <h3 className="font-medium">
              Second Indo-Tibetan Scholars Conference, 2022
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Speaker on the integration of contemplative practice and Buddhist
              psychology
            </p>
          </div>
          <div className="border-l-2 border-neutral-200 pl-4 dark:border-neutral-800">
            <h3 className="font-medium">
              Emory Tibet Science Initiative Summer Program
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Translator facilitating English-Tibetan translation of scientific
              materials, promoting interdisciplinary learning among monastic
              scholars
            </p>
          </div>
          <div className="border-l-2 border-neutral-200 pl-4 dark:border-neutral-800">
            <h3 className="font-medium">Seminars &amp; Workshops</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Translator at various seminars and workshops, supporting the
              integration of science and Buddhist philosophy
            </p>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          Education &amp; Certifications
        </h2>
        <div className="mt-6">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
            Gaden Shartse Monastery
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                Lophon Certificate
              </span>{" "}
              (Four Years Completion PhD) &mdash; 2024
            </li>
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                Karam Certificate
              </span>{" "}
              (Two Years Completion PhD) &mdash; 2022
            </li>
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                Vinaya Certificate
              </span>{" "}
              (Buddhist Ethics) &mdash; 2020
            </li>
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                Abhidharma Certificate
              </span>{" "}
              (Epistemology &amp; Metaphysics) &mdash; 2018
            </li>
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                Madhyamika Certificate
              </span>{" "}
              (Central Philosophy) &mdash; 2017
            </li>
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                Prajnaparamita Certificate
              </span>{" "}
              (Perfection of Wisdom) &mdash; 2014
            </li>
            <li>
              <span className="text-neutral-900 dark:text-neutral-100">
                Pramanavartika Certificate
              </span>{" "}
              (Buddhist Logic) &mdash; 2009
            </li>
          </ul>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            Currently pursuing the Great Gelug Examination (Geshe Lharampa,
            PhD), with four years completed as the top performer each year.
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">Skills</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((category) => (
            <div key={category.name}>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                {category.name}
              </h3>
              <ul className="mt-2 space-y-1">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">
          Other Contributions
        </h2>
        <div className="mt-6 space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>
            Conducted teachings and Dharma talks in Singapore, engaging
            international audiences in Buddhist studies.
          </p>
          <p>
            Successfully completed six years of the Comprehensive Science
            Program at Gaden Shartse Monastery, contributing to the integration
            of science and Buddhist thought.
          </p>
        </div>
      </Container>
    </section>
  );
}
