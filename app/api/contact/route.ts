import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// SMTP transporter oluştur
// Eğer info@asagrouglobal.com için özel SMTP ayarları varsa, bunları kullanın
// Aksi halde Gmail SMTP kullanılacak
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.GMAIL_USER || 'bedirhanugurlu3661@gmail.com',
    pass: process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '', // App Password gerekli
  },
})

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
    const toEmail = process.env.SMTP_TO_EMAIL || process.env.GMAIL_TO_EMAIL || 'info@asagrouglobal.com'
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || process.env.GMAIL_USER || 'bedirhanugurlu3661@gmail.com'
    
    console.log('Sending email to:', toEmail)
    console.log('From email:', fromEmail)
    
    const mailOptions = {
      from: `"ASA Group" <${fromEmail}>`,
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
    }
    
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)

    // İsteğe bağlı: Kullanıcıya onay maili göndermek için
    // const confirmationMail = await transporter.sendMail({
    //   from: `"ASA Group" <${fromEmail}>`,
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
        emailId: info.messageId || null
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
