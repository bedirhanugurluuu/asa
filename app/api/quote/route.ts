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
    const {
      address,
      bedrooms,
      maxGuests,
      selectedMonths,
      isOwner,
      fullName,
      email,
      phone,
      company,
      message,
    } = body

    // Validation
    if (!address || !bedrooms || !maxGuests || !selectedMonths || isOwner === null || !fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format months
    const monthsText = selectedMonths.join(', ')

    // Email to company
    const toEmail = process.env.SMTP_TO_EMAIL || process.env.GMAIL_TO_EMAIL || 'info@asagrouglobal.com'
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || process.env.GMAIL_USER || 'bedirhanugurlu3661@gmail.com'
    
    console.log('Sending email to:', toEmail)
    console.log('From email:', fromEmail)
    
    const mailOptions = {
      from: `"ASA Group" <${fromEmail}>`,
      to: toEmail,
      replyTo: email, // Kullanıcının email'ini reply-to olarak ekle
      subject: `Yeni Teklif Talebi - ${fullName}`,
      html: `
        <h2>Yeni Teklif Talebi</h2>
        <h3>Mülk Bilgileri</h3>
        <p><strong>Adres:</strong> ${address}</p>
        <p><strong>Oda Sayısı:</strong> ${bedrooms}</p>
        <p><strong>Maksimum Konuk Sayısı:</strong> ${maxGuests}</p>
        <p><strong>Kiralama Ayları:</strong> ${monthsText}</p>
        <p><strong>Mülk Sahibi:</strong> ${isOwner ? 'Evet' : 'Hayır'}</p>
        
        <h3>İletişim Bilgileri</h3>
        <p><strong>Ad Soyad:</strong> ${fullName}</p>
        <p><strong>E-posta:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Şirket:</strong> ${company || 'Belirtilmemiş'}</p>
        ${message ? `<p><strong>Mesaj:</strong> ${message.replace(/\n/g, '<br>')}</p>` : ''}
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
    //   subject: 'Teklif Talebiniz Alındı - ASA Group Luxury Rent',
    //   html: `
    //     <h2>Teklif Talebiniz Alındı</h2>
    //     <p>Merhaba ${fullName},</p>
    //     <p>Teklif talebinizi aldık. Mülkünüz için özel gelir raporu ve hizmet teklifi hazırlayıp en kısa sürede size e-posta yoluyla göndereceğiz.</p>
    //     <p>İyi günler,<br>ASA Group Luxury Rent Ekibi</p>
    //   `,
    // })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Quote request sent successfully',
        emailId: info.messageId || null
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Quote form error:', error)
    console.error('Error details:', {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      response: error?.response
    })
    return NextResponse.json(
      { 
        error: 'Failed to send quote request',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
