import mongoose, { Schema, Document } from 'mongoose';

// Define an interface that extends mongoose.Document to specify the type of data for the schema
export interface IAccount extends Document {
    username: string;
    password: string;
    fullname: string;
    role: string;
    ishidden: boolean;
}
// Define the schema
const AccountSchema: Schema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    role: { type: String, required: true },
    ishidden: { type: Boolean }
}, {
    collection: 'account'
});
// Create the model
const AccountModel = mongoose.model<IAccount>('account', AccountSchema);
// Export the model
export default AccountModel;
