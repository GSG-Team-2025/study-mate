'use client';

import { useActionState, useState } from 'react';
import { updatePassword } from '@/app/actions/security';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';
import { Loader2, Save, Lock, Eye, EyeOff, Shield, KeyRound } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';

const initialState = {
    message: '',
    error: '',
    fieldErrors: {},
    success: false
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

function SubmitButton({ isDisabled = false }: { isDisabled?: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending || isDisabled}
            className={cn(
                "w-full sm:w-auto min-w-[140px] shadow-lg transition-all",
                isDisabled
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60 shadow-none hover:shadow-none"
                    : "shadow-primary/20 hover:shadow-primary/30"
            )}
        >
            {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : <><Save className="mr-2 h-4 w-4" /> Update Password</>}
        </Button>
    );
}

export function SecuritySettings() {
    const [state, action] = useActionState(updatePassword, initialState);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation
    const isPasswordLongEnough = newPassword.length >= 8;
    const doPasswordsMatch = newPassword === confirmPassword && newPassword.length > 0;
    const isFormValid = isPasswordLongEnough && doPasswordsMatch;
    const isDirty = newPassword.length > 0 || confirmPassword.length > 0;
    const isSubmitDisabled = !isDirty || !isFormValid;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Security Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage your account security and password</p>
                </div>
            </div>

            <form action={action}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    <div className="p-6 bg-muted/20 rounded-xl border border-border/50">
                        <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <KeyRound className="w-4 h-4" /> Change Password
                        </h4>

                        <div className="space-y-4">
                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="newPassword">New Password <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        minLength={8}
                                        className={cn(
                                            "pr-10 transition-colors",
                                            state?.fieldErrors?.newPassword ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "bg-muted/30 focus:bg-background"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-colors",
                                        isPasswordLongEnough ? "bg-green-500" : "bg-muted-foreground/30"
                                    )} />
                                    <span className={cn(
                                        "transition-colors",
                                        isPasswordLongEnough ? "text-green-600 dark:text-green-500 font-medium" : "text-muted-foreground"
                                    )}>
                                        At least 8 characters
                                    </span>
                                </div>
                                {state?.fieldErrors?.newPassword && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{state.fieldErrors.newPassword[0]}</p>}
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className={cn(
                                            "pr-10 transition-colors",
                                            state?.fieldErrors?.confirmPassword ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "bg-muted/30 focus:bg-background"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-colors",
                                        doPasswordsMatch ? "bg-green-500" : "bg-muted-foreground/30"
                                    )} />
                                    <span className={cn(
                                        "transition-colors",
                                        doPasswordsMatch ? "text-green-600 dark:text-green-500 font-medium" : "text-muted-foreground"
                                    )}>
                                        Passwords match
                                    </span>
                                </div>
                                {state?.fieldErrors?.confirmPassword && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{state.fieldErrors.confirmPassword[0]}</p>}
                            </motion.div>
                        </div>
                    </div>

                    {state?.error && (
                        <motion.div variants={itemVariants} className="p-3 rounded-lg bg-red-500/10 text-red-600 border border-red-500/20 text-sm flex items-center gap-2">
                            <Shield className="w-4 h-4" /> {state.error}
                        </motion.div>
                    )}
                    {state?.success && (
                        <motion.div variants={itemVariants} className="p-3 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20 text-sm flex items-center gap-2">
                            <Shield className="w-4 h-4" /> {state.message}
                        </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="flex justify-end pt-4 border-t border-dashed">
                        <SubmitButton isDisabled={isSubmitDisabled} />
                    </motion.div>
                </motion.div>
            </form>
        </div>
    );
}
