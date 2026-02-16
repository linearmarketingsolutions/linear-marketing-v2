import { Resend } from 'resend';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    // Check for API key
    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not configured');
        return res.status(500).json({ success: false, error: 'Email service not configured.' });
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
        const { name, email, company, position, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !company || !position || !message) {
            return res.status(400).json({
                success: false,
                error: 'Please fill in all required fields.'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Please enter a valid email address.'
            });
        }
        
        // Send email via Resend
        const { data, error } = await resend.emails.send({
            from: 'Linear Marketing Solutions <onboarding@resend.dev>',
            to: ['info@linearmarketingsolutions.com'],
            replyTo: email,
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0066FF; border-bottom: 2px solid #0066FF; padding-bottom: 12px; margin-bottom: 24px;">
                        New Contact Form Submission
                    </h2>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                        <tr style="border-bottom: 1px solid #E0E0E0;">
                            <td style="padding: 12px 0; font-weight: 600; width: 120px; color: #666;">Name</td>
                            <td style="padding: 12px 0; color: #0A0A0A;">${name}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #E0E0E0;">
                            <td style="padding: 12px 0; font-weight: 600; color: #666;">Email</td>
                            <td style="padding: 12px 0;"><a href="mailto:${email}" style="color: #0066FF; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #E0E0E0;">
                            <td style="padding: 12px 0; font-weight: 600; color: #666;">Company</td>
                            <td style="padding: 12px 0; color: #0A0A0A;">${company}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #E0E0E0;">
                            <td style="padding: 12px 0; font-weight: 600; color: #666;">Position</td>
                            <td style="padding: 12px 0; color: #0A0A0A;">${position}</td>
                        </tr>
                    </table>
                    
                    <div style="margin-top: 24px;">
                        <p style="font-weight: 600; color: #666; margin-bottom: 12px;">Message:</p>
                        <div style="background: #F5F5F5; padding: 16px; border-radius: 8px; border-left: 4px solid #0066FF; color: #0A0A0A; line-height: 1.6;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    
                    <p style="margin-top: 32px; color: #999; font-size: 14px; text-align: center;">
                        Sent from Linear Marketing Solutions website
                    </p>
                </div>
            `
        });
        
        if (error) {
            console.error('Resend error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to send message. Please try again or email us directly.'
            });
        }
        
        console.log('Email sent successfully:', data);
        return res.status(200).json({
            success: true,
            message: 'Thank you for reaching out! We\'ll respond within 24 hours.'
        });
        
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            success: false,
            error: 'An unexpected error occurred. Please try again later.'
        });
    }
}
