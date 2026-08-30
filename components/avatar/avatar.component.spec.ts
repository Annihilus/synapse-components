import { setupComponent } from '../../testing/setup';
import { SynapseAvatarComponent } from './avatar.component';

describe('SynapseAvatarComponent', () => {
  it('adds the data: prefix to bare base64', async () => {
    const fixture = await setupComponent(SynapseAvatarComponent);
    fixture.componentRef.setInput('src', 'aGk=');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toContain('data:image/png;base64,aGk=');
    expect((fixture.nativeElement as HTMLElement).classList.contains('image')).toBe(true);
  });

  it('leaves the mime of a ready data: URI alone', async () => {
    const fixture = await setupComponent(SynapseAvatarComponent);
    fixture.componentRef.setInput('src', 'data:image/jpeg;base64,aGk=');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toContain('data:image/jpeg;base64,');
  });

  it('passes a plain URL through', async () => {
    const fixture = await setupComponent(SynapseAvatarComponent);
    fixture.componentRef.setInput('src', '/media/face.png');
    fixture.componentRef.setInput('alt', 'Jordan');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toContain('/media/face.png');
    expect(img.getAttribute('alt')).toBe('Jordan');
  });

  it('reads a number size as pixels and a string as a CSS value', async () => {
    const fixture = await setupComponent(SynapseAvatarComponent);
    const host = fixture.nativeElement as HTMLElement;

    expect(host.style.width).toBe('36px');
    expect(host.style.height).toBe('36px');

    fixture.componentRef.setInput('size', '2rem');
    fixture.detectChanges();
    expect(host.style.width).toBe('2rem');
  });

  it('falls back through initials, upload and the generic user icon', async () => {
    const fixture = await setupComponent(SynapseAvatarComponent);
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('syn-icon.user')).toBeTruthy();

    fixture.componentRef.setInput('upload', true);
    fixture.detectChanges();
    expect(host.querySelector('syn-icon.photo_add')).toBeTruthy();
    expect(host.classList.contains('upload')).toBe(true);

    fixture.componentRef.setInput('initials', 'JD');
    fixture.detectChanges();
    expect(host.textContent).toContain('JD');
    expect(host.classList.contains('initials')).toBe(true);
  });

  it('yields an empty url when there is no source', async () => {
    const fixture = await setupComponent(SynapseAvatarComponent);

    expect(fixture.componentInstance['url']()).toBe('');
  });
});
