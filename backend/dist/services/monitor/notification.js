import twilio from 'twilio';
const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const fromNumber = process.env.TWILIO_FROM_NUMBER || '';
const toNumber = process.env.USER_PHONE_NUMBER || '';
function getClient() {
    if (!accountSid || !authToken)
        return null;
    if (!accountSid.startsWith('AC'))
        return null;
    return twilio(accountSid, authToken);
}
export async function sendSms(body) {
    if (!fromNumber || !toNumber)
        return;
    const client = getClient();
    if (!client)
        return;
    await client.messages.create({ from: fromNumber, to: toNumber, body });
}
export async function placeCall(message) {
    if (!fromNumber || !toNumber)
        return;
    const client = getClient();
    if (!client)
        return;
    const twiml = `<Response><Say>${message}</Say></Response>`;
    await client.calls.create({ from: fromNumber, to: toNumber, twiml });
}
