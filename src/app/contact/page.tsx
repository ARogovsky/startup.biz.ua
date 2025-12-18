"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { PageTitle } from "@/components/elements/PageTitle";
import { Footer } from "@/components/Footer";
import { PiBookBookmarkThin, PiIdentificationCardThin, PiMapPinThin } from "react-icons/pi";
import Link from "next/link";

interface ContactFormProps {
    searchParams: URLSearchParams;
}

function ContactContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('message');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [candidateMessage, setCandidateMessage] = useState('');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'message' || tab === 'candidate' || tab === 'vacancy') {
            setActiveTab(tab);
        }
        // Prefill from vacancy page (candidate tab)
        if (tab === 'candidate') {
            const title = searchParams.get('title') || '';
            const company = searchParams.get('company') || '';
            const type = searchParams.get('type') || '';
            const location = searchParams.get('location') || '';
            const ref = searchParams.get('ref') || '';
            const summary = [`Вакансія: ${title}`, company && `Компанія: ${company}`, type && `Тип: ${type}`, location && `Локація: ${location}`, ref && `Посилання: /vacancies/${ref}`]
                .filter(Boolean)
                .join('\n');
            setCandidateMessage(summary);
        } else {
            setCandidateMessage('');
        }
    }, [searchParams]);

    const submitToWeb3Forms = async (payload: any) => {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                access_key: '067701af-ccdb-4eb9-8d41-398cd80dd788',
                // Web3Forms recommended extras
                redirect: `${window.location.origin}/thank-you`,
                botcheck: '',
                ...payload
            })
        });
        const json = await res.json();
        return json;
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>, type: string) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const form = e.currentTarget;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Prepare subject/from_name per tab
            const subjectMap: Record<string, string> = {
                message: 'Повідомлення з контактної форми',
                candidate: 'Надіслано кандидата',
                vacancy: 'Додано вакансію'
            };
            const fromName = type === 'message' ? (data.name || '') : type === 'candidate' ? (data.candidate_name || '') : (data.organization || data.contact_name || '');

            const payload = {
                type,
                subject: subjectMap[type] || 'Повідомлення',
                from_name: fromName,
                ...data
            };
            const json = await submitToWeb3Forms(payload);
            if (json.success) {
                // Since we don't have navigate/router.push to custom thank-you page yet, or we can use the same pattern.
                // Assuming we want to redirect or show message. Donor used navigate('/thank-you').
                // Ideally we should create a Thank You page too or use flash message.
                // For now, I'll alert success or assume there is a /thank-you page (which I saw earlier in file list? No I didn't create it yet).
                // Wait, I saw ThankYou.jsx in donor file list.
                // I will assume I should just redirect to home or show success state.
                // But let's create a minimal thank you page or state.
                // For now:
                alert("Дякуємо! Ваше повідомлення надіслано.");
            } else {
                setError(json.message || 'Не вдалося надіслати форму. Спробуйте ще раз.');
            }
        } catch (err) {
            setError('Сталася помилка. Спробуйте ще раз.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <section id="contact" className='p-b-120'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 form-iframe">
                            <div className="m-show">
                                <h3>
                                    <span className="c-green title-part fw-400">Маєте запитання? </span><br />
                                    <span className="c-dark title-mini fz-18">Зв'яжіться з нами за допомогою контактної форми</span>
                                </h3>
                                <hr className="m-y-24" />
                            </div>

                            <div className="flex m-b-16" role="tablist" aria-label="Вкладки форми">
                                <button type="button" className={`button ${activeTab === 'message' ? '' : 'button-outline'} m-r-8`} onClick={() => setActiveTab('message')}>Повідомлення</button>
                                <button type="button" className={`button ${activeTab === 'candidate' ? '' : 'button-outline'} m-r-8`} onClick={() => setActiveTab('candidate')}>Знайти роботу</button>
                                <button type="button" className={`button ${activeTab === 'vacancy' ? '' : 'button-outline'}`} onClick={() => setActiveTab('vacancy')}>Додати вакансію</button>
                            </div>

                            {error && <div className="alert alert-danger m-b-16" role="alert">{error}</div>}

                            {activeTab === 'message' && (
                                <form onSubmit={(e) => onSubmit(e, 'message')} noValidate className="card p-24 r-8">
                                    <div className="row">
                                        <div className="col-12 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Ваше ім'я</label>
                                            <input name="name" type="text" className="w-100 p-12 r-6" placeholder="Ім'я" required />
                                        </div>
                                        <div className="col-12 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Email</label>
                                            <input name="email" type="email" className="w-100 p-12 r-6" placeholder="name@example.com" required />
                                        </div>
                                        <div className="col-12 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Повідомлення</label>
                                            <textarea name="message" className="w-100 p-12 r-6" rows={6} placeholder="Ваше повідомлення" required />
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="button" disabled={submitting}>{submitting ? 'Надсилання...' : 'Надіслати'}</button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'candidate' && (
                                <form onSubmit={(e) => onSubmit(e, 'candidate')} noValidate className="card p-24 r-8">
                                    <div className="row">
                                        <div className="col-12 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Ім'я кандидата</label>
                                            <input name="candidate_name" type="text" className="w-100 p-12 r-6" placeholder="Ім'я" required />
                                        </div>
                                        <div className="col-12 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Телефон (обов'язково)</label>
                                            <input name="phone" type="tel" className="w-100 p-12 r-6" placeholder="+380..." required />
                                        </div>
                                        <div className="col-md-6 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Telegram (обов'язково)</label>
                                            <input name="telegram" type="text" className="w-100 p-12 r-6" placeholder="@username" required />
                                        </div>
                                        <div className="col-md-6 m-b-12">
                                            <label className="title-mini m-b-4 d-block">LinkedIn (обов'язково)</label>
                                            <input name="linkedin" type="url" className="w-100 p-12 r-6" placeholder="https://linkedin.com/in/..." required />
                                        </div>
                                        <div className="col-12 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Email (обов'язково)</label>
                                            <input name="email" type="email" className="w-100 p-12 r-6" placeholder="name@example.com" required />
                                        </div>
                                        <div className="col-12 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Коментар</label>
                                            <textarea name="message" className="w-100 p-12 r-6" rows={5} placeholder="Додаткова інформація" value={candidateMessage} onChange={e => setCandidateMessage(e.target.value)} />
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="button" disabled={submitting}>{submitting ? 'Надсилання...' : 'Надіслати відгук'}</button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'vacancy' && (
                                <form onSubmit={(e) => onSubmit(e, 'vacancy')} noValidate className="card p-24 r-8">
                                    <div className="row">
                                        <div className="col-12 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Назва організації</label>
                                            <input name="organization" type="text" className="w-100 p-12 r-6" placeholder="Організація" required />
                                        </div>
                                        <div className="col-12 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Опис вакансії</label>
                                            <textarea name="vacancy_description" className="w-100 p-12 r-6" rows={6} placeholder="Короткий опис" required />
                                        </div>
                                        <div className="col-md-6 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Телефон (обов'язково)</label>
                                            <input name="phone" type="tel" className="w-100 p-12 r-6" placeholder="+380..." required />
                                        </div>
                                        <div className="col-md-6 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Email (обов'язково)</label>
                                            <input name="email" type="email" className="w-100 p-12 r-6" placeholder="name@example.com" required />
                                        </div>
                                        <div className="col-12 m-b-12">
                                            <label className="title-mini m-b-4 d-block">Контактна особа</label>
                                            <input name="contact_name" type="text" className="w-100 p-12 r-6" placeholder="Ім'я" />
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="button" disabled={submitting}>{submitting ? 'Надсилання...' : 'Додати вакансію'}</button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                        <div className="col-lg-6 p-x-80 form-text">
                            <div className="m-hide">
                                <h3 className='p-t-16'>
                                    <span className="c-green title-part fw-400">Маєте запитання? </span><br />
                                    <span className="c-dark title-mini fz-18">Зв'яжіться з нами за допомогою контактної форми</span>
                                </h3>
                                <hr className="m-y-24" />
                            </div>
                            <h3 className="c-dark p-b-16">
                                <span>Наші реквізіти</span>
                            </h3>
                            <div className="title-sub p-b-16 flex">
                                <PiBookBookmarkThin className="c-green w-p-32 h-p-32 flex aic jcc" />
                                <span className="c-dark p-l-8">Громадська організація<br />«ТопИздаТо»</span>
                            </div>
                            <div className="title-sub p-b-16 flex">
                                <PiIdentificationCardThin className="c-green w-p-32 h-p-32 flex aic jcc" />
                                <span className="c-dark p-l-8">Код ЄДРПОУ<br />44894768</span>
                            </div>
                            <div className="title-sub p-b-16 flex">
                                <PiMapPinThin className="c-green w-p-32 h-p-32 flex aic jcc" />
                                <span className="c-dark p-l-8">65007, Україна, Одеська обл., місто Одеса,<br />вулиця Старопортофранківська,<br />будинок 107, квартира 21</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default function Contact() {
    return (
        <>
            <Header />
            <PageTitle title="Контакти" page="Головна" link="/" />
            <Suspense fallback={<div>Loading...</div>}>
                <ContactContent />
            </Suspense>
            <Footer />
        </>
    );
}
