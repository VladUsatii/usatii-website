'use client'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import Footer from '../_components/footer'
import { motion } from 'framer-motion'

const jobs = [
  {
    id: 'content-editor',
    title: 'Content Editor',
    location: 'Fully remote',
    compensation: '$20 / hour',
    summary:
      'Edit catchy short-form content that is built to perform across modern social channels. We expect excellence -- not a beginner role.',
    description:
      'Content Editors at USATII help turn raw footage, rough drafts, and existing creative direction into polished deliverables. This role is execution-heavy and quality-sensitive. You should be comfortable following systems, moving quickly, and maintaining strong visual and editorial judgment under deadlines.',
    duties: [
      'Edit 6-10 short-form videos per day using provided footage, briefs, and brand direction.',
      'Refine pacing, cuts, captions, hooks, and supporting visual elements to improve clarity and retention.',
      'Maintain consistency across client accounts, content series, and brand standards.',
      'Collaborate with internal creative and strategy teams to revise content quickly.',
      'Organize files, exports, and deliverables in a clean and reliable way.',
      'Help identify repeatable editing patterns that improve output quality and throughput.',
    ],
    qualifications: [
      'Experience editing short-form content for social platforms.',
      'Strong sense of pacing, hook structure, visual cleanliness, and audience retention.',
      'Able to work independently, communicate clearly, and handle revisions professionally.',
      'Comfortable working in a fast-moving remote environment.',
      'Portfolio or examples of relevant editing work preferred.',
    ],
  },
  {
    id: 'platform-marketing-lead',
    title: 'Platform Marketing Lead',
    type: 'Full-time',
    location: 'Fully remote',
    compensation: '$50,000 / year',
    summary:
      'Lead platform-level marketing execution and growth strategy across the channels and systems that drive attention, demand, and client acquisition.',
    description:
      'The Platform Marketing Lead owns high-level marketing direction across the business and helps translate strategy into real platform performance. This role is for someone who can think structurally, write clearly, make strong channel decisions, and keep execution aligned with growth goals.',
    duties: [
      'Own platform-level marketing planning across social, web, and related acquisition surfaces.',
      'Develop and manage campaign direction, positioning, and channel-specific execution priorities.',
      'Work with editors, operators, and leadership to keep messaging and output aligned.',
      'Monitor performance signals and recommend changes to improve reach, conversion, and consistency.',
      'Help define publishing priorities, platform expansion opportunities, and distribution systems.',
      'Contribute to marketing-informed operational decisions by connecting campaign performance to business needs.',
    ],
    qualifications: [
      'Experience in platform marketing, growth, content strategy, or a closely related role.',
      'Strong understanding of how content, distribution, and positioning interact across channels.',
      'Able to think both strategically and operationally.',
      'Strong written communication and decision-making ability.',
      'Comfortable leading remotely and working across multiple moving parts at once.',
    ],
  },
]

function JobCard({ job, onApply }) {
  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {job.title}
            </h3>
            <p className="mt-2 text-base sm:text-lg text-gray-600 font-medium">
              {job.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              {job.location}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              {job.compensation}
            </span>
          </div>
        </div>

        <div className="grid gap-6 pt-2">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-500">
              Role overview
            </h4>
            <p className="mt-2 text-gray-700 font-medium leading-7">
              {job.description}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-500">
                Duties
              </h4>
              <ul className="mt-3 space-y-3 text-gray-700 font-medium">
                {job.duties.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-500">
                Qualifications
              </h4>
              <ul className="mt-3 space-y-3 text-gray-700 font-medium">
                {job.qualifications.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gray-900 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Careers() {
  const [selectedRole, setSelectedRole] = useState(jobs[0].id)
  const [resumeName, setResumeName] = useState('')
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedRole) || jobs[0],
    [selectedRole]
  )

  const clearSubmitState = () => {
    setSubmitStatus('idle')
    setSubmitMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus('submitting')
    setSubmitMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = {
      fullName: String(formData.get('fullName') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      roleId: selectedRole,
      linkedin: String(formData.get('linkedin') || '').trim(),
      notes: String(formData.get('notes') || '').trim(),
      resumeName,
    }

    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => null)
      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage(
          'Application submitted successfully. Our team will review it and follow up if there is a fit.'
        )
        form.reset()
        setResumeName('')
        return
      }

      if (response.status === 409) {
        setSubmitStatus('duplicate')
        setSubmitMessage(
          data?.error ||
            'Only one careers submission is allowed per IP address.'
        )
        return
      }

      setSubmitStatus('error')
      setSubmitMessage(
        data?.error || 'Unable to submit right now. Please try again shortly.'
      )
    } catch {
      setSubmitStatus('error')
      setSubmitMessage('Network error. Please try again in a moment.')
    }
  }

  return (
    <>
      <div className="max-w-[980px] w-full mx-auto px-6 sm:px-8 py-12 bg-white">
        <Link href="/">
          <h1 className="font-black text-center text-md text-indigo-600 hover:text-indigo-800 transition-colors">
            USATII MEDIA
          </h1>
        </Link>

        <div className="flex flex-col justify-center items-center mt-6 gap-y-8 text-center">
          <h2 className="text-gray-900 text-4xl sm:text-5xl font-bold">
            Careers
          </h2>
          <p className="mt-4 text-gray-700 text-lg font-medium leading-8 max-w-2xl">
            We are looking for people with strong portfolios only. Tell the truth on applications: if it is hidden behind an NDA, you're lying. Remote-only.
          </p>
          <hr className='max-w-2xl w-full'/>
        </div>

        <motion.div
          className="mt-10 grid gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55 }}
        >
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={(jobId) => {
                setSelectedRole(jobId)
                clearSubmitState()
                if (typeof window !== 'undefined') {
                  const el = document.getElementById('application-form')
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
            />
          ))}
        </motion.div>

        <motion.div
          id="application-form"
          className="mt-12 rounded-[28px] border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55 }}
        >
          <div className="max-w-[760px]">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Apply now.
            </h3>
            <p className="mt-3 text-gray-700 font-medium leading-7">
              By submitting, you agree that you are eligible to work in your jurisdiction.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-gray-500"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-gray-500"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-gray-500"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value)
                    clearSubmitState()
                  }}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-400"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-gray-500"
                >
                  Work setup
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={selectedJob.location}
                  readOnly
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="linkedin"
                className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-gray-500"
              >
                LinkedIn or portfolio
              </label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                placeholder="https://"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-gray-500"
              >
                Why you are a fit
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={5}
                placeholder="Briefly explain your experience and why you want the role."
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400"
              />
            </div>

            <div>
              <label
                htmlFor="resume"
                className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-gray-500"
              >
                Resume
              </label>
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    setResumeName(file ? file.name : '')
                    clearSubmitState()
                  }}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-black"
                />
                <p className="mt-3 text-sm font-medium text-gray-500">
                  Accepted formats: PDF, DOC, DOCX.
                  {resumeName ? ` Selected: ${resumeName}` : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={submitStatus === 'submitting'}
                className="inline-flex w-fit items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-black text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitStatus === 'submitting'
                  ? 'Submitting...'
                  : 'Submit application'}
              </button>
              {submitStatus === 'success' && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {submitMessage}
                </div>
              )}
              {submitStatus === 'duplicate' && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  {submitMessage}
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {submitMessage}
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      <Footer />
    </>
  )
}

export default Careers
