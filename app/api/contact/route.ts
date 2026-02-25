import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_KBrXLhVJ_CC2LcS6Bd3YR2nUq3msLYaTA')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, message } = body

    // Validation
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email to company
    const toEmail = process.env.RESEND_TO_EMAIL || 'info@asagrouglobal.com'
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    
    console.log('Sending email to:', toEmail)
    console.log('From email:', fromEmail)
    
    const emailToCompany = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email, // Kullanıcının email'ini reply-to olarak ekle
      subject: `Yeni İletişim Formu Mesajı - ${firstName} ${lastName}`,
      html: `
        <h2>Yeni İletişim Formu Mesajı</h2>
        <p><strong>İsim:</strong> ${firstName} ${lastName}</p>
        <p><strong>E-posta:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Telefon:</strong> ${phone || 'Belirtilmemiş'}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">Bu mesajı yanıtlamak için yukarıdaki e-posta adresine tıklayın.</p>
      `,
    })
    
    console.log('Email sent successfully:', emailToCompany.data)

    // Confirmation email to user (opsiyonel - domain doğrulaması gerektirir)
    // Eğer domain doğrulaması yapmadıysanız bu kısmı yorum satırı yapın
    // const emailToUser = await resend.emails.send({
    //   from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    //   to: email,
    //   subject: 'Mesajınız Alındı - ASA Group Luxury Rent',
    //   html: `
    //     <h2>Mesajınız Alındı</h2>
    //     <p>Merhaba ${firstName},</p>
    //     <p>Mesajınızı aldık. En kısa sürede size geri dönüş sağlayacağız.</p>
    //     <p>İyi günler,<br>ASA Group Luxury Rent Ekibi</p>
    //   `,
    // })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email sent successfully',
        emailId: emailToCompany.data?.id || null
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Contact form error:', error)
    console.error('Error details:', {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      response: error?.response
    })
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
